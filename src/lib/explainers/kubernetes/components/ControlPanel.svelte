<script lang="ts">
	/**
	 * @fileoverview Control Panel Component for Kubernetes Explainer
	 *
	 * Provides user interface for:
	 * - Selecting request scenarios (User Login, Create Order, etc.)
	 * - Controlling animation speed (0.5x - 2x)
	 * - Starting/stopping request flow animations
	 *
	 * This component orchestrates the RequestFlowEngine (simulation)
	 * and RequestFlowAnimator (visualization) to create realistic
	 * request flow demonstrations through the Kubernetes architecture.
	 *
	 * @module ControlPanel
	 * @requires ../utils/requestFlow - For request simulation with proper latency
	 * @requires ../utils/animation - For GSAP-based visual animations
	 */
	import { onDestroy } from 'svelte';
	import Slider from '~/lib/shared/components/Slider.svelte';
	import {
		selectedExampleIdx,
		animationSpeed,
		isAnimating,
		exampleRequests,
		activeRequest
	} from '../store';
	import { RequestFlowEngine } from '../utils/requestFlow';
	import { requestFlowAnimator } from '../utils/animation';
	import type { RequestEvent } from '../types/kubernetes';

	/**
	 * Request flow engine instance
	 * Handles realistic simulation with proper latency calculation using
	 * Box-Muller transform for normal distribution
	 * @type {RequestFlowEngine}
	 */
	const requestEngine = new RequestFlowEngine();

	/**
	 * Tracks if a request is currently running
	 * Prevents multiple simultaneous requests
	 * @type {boolean}
	 */
	let isRequestRunning = false;

	/**
	 * Starts the request flow animation for the selected scenario
	 *
	 * Orchestrates both visual animation (GSAP) and simulation (RequestFlowEngine):
	 * 1. Validates scenario selection
	 * 2. Extracts component path from scenario
	 * 3. Initializes active request in store
	 * 4. Starts GSAP animation timeline (visual)
	 * 5. Runs RequestFlowEngine simulation (data) in parallel
	 * 6. Updates trace/span IDs with OpenTelemetry format
	 * 7. Cleans up on completion or error
	 *
	 * Both animation and simulation run concurrently with Promise.all()
	 * for optimal performance and synchronization.
	 *
	 * @async
	 * @returns {Promise<void>}
	 * @throws {Error} Logs error to console, doesn't throw to caller
	 *
	 * @example
	 * ```typescript
	 * // Called when user clicks "Start Flow" button
	 * await startAnimation();
	 * // Result: Components highlight sequentially with GSAP
	 * //         Metrics update with realistic latency
	 * //         Store tracks current step and trace IDs
	 * ```
	 */
	async function startAnimation(): Promise<void> {
		if ($selectedExampleIdx < 0 || $selectedExampleIdx >= exampleRequests.length) {
			console.warn('Invalid example index:', $selectedExampleIdx);
			return;
		}

		if (isRequestRunning) {
			console.warn('Request already running');
			return;
		}

		const scenario = exampleRequests[$selectedExampleIdx];
		isAnimating.set(true);
		isRequestRunning = true;

		try {
			// Extract component IDs from path
			const componentPath = scenario.path.map((step) => step.component);

			// Initialize active request
			activeRequest.set({
				id: scenario.id,
				path: componentPath,
				currentStep: 0,
				data: {
					method: scenario.method || 'POST',
					endpoint: scenario.endpoint || '/api/request',
					headers: scenario.headers || { 'Content-Type': 'application/json' },
					body: scenario.body,
					traceId: '', // Will be set by RequestFlowEngine
					spanId: '' // Will be set by RequestFlowEngine
				},
				timestamp: Date.now()
			});

			// Start visual animation
			const animationPromise = requestFlowAnimator.animate(
				componentPath,
				{
					duration: 3000,
					speed: $animationSpeed,
					loop: false
				},
				(progress: number, currentStep: number) => {
					// Update active request with current step
					activeRequest.update((req) => {
						if (req) {
							return { ...req, currentStep };
						}
						return req;
					});
				}
			);

			// Start request simulation
			const requestPromise = requestEngine.simulateRequest(
				scenario,
				(event: RequestEvent) => {
					// Handle request events (component entry/exit, errors)
					if (event.type === 'error') {
						console.error('Request error:', event.error);
					}
					// Update request data with trace information
					if (event.type === 'start' && event.traceId) {
						activeRequest.update((req) => {
							if (req && req.data) {
								return {
									...req,
									data: {
										...req.data,
										traceId: event.traceId || '',
										spanId: event.spanId || ''
									}
								};
							}
							return req;
						});
					}
				}
			);

			// Wait for both animation and simulation to complete
			await Promise.all([animationPromise, requestPromise]);
		} catch (error) {
			console.error('Animation error:', error);
		} finally {
			// Clean up
			isAnimating.set(false);
			activeRequest.set(null);
			isRequestRunning = false;
		}
	}

	/**
	 * Stops the current animation and cleans up resources
	 *
	 * Performs complete cleanup:
	 * 1. Cancels GSAP animation timeline
	 * 2. Resets animation state flag
	 * 3. Clears active request from store
	 * 4. Resets request running flag
	 *
	 * Safe to call multiple times or when no animation is running.
	 * Called automatically on component destroy.
	 *
	 * @returns {void}
	 *
	 * @example
	 * ```typescript
	 * // User clicks "Stop" button
	 * stopAnimation();
	 * // Result: Animation stops immediately
	 * //         All state resets to initial values
	 * //         Ready for next animation
	 * ```
	 */
	function stopAnimation(): void {
		requestFlowAnimator.cancel();
		isAnimating.set(false);
		activeRequest.set(null);
		isRequestRunning = false;
	}

	/**
	 * Lifecycle: Component destroy
	 *
	 * Ensures proper cleanup when component unmounts:
	 * - Stops any running animations
	 * - Prevents memory leaks
	 * - Cleans up GSAP timelines
	 *
	 * @returns {void}
	 */
	onDestroy(() => {
		stopAnimation();
	});
</script>

<div class="control-panel">
	<h3 class="text-lg font-bold text-gray-800 mb-4">Request Scenarios</h3>

	<!-- Example Selector -->
	<div class="scenarios">
		{#each exampleRequests as example, idx}
			<button
				class="scenario-btn"
				class:active={$selectedExampleIdx === idx}
				on:click={() => selectedExampleIdx.set(idx)}
			>
				<span class="scenario-label">{example.label}</span>
				<span class="scenario-desc">{example.description}</span>
			</button>
		{/each}
	</div>

	<!-- Animation Controls -->
	<div class="controls-section">
		<h4 class="text-sm font-semibold text-gray-700 mb-2">Animation</h4>

		<div class="control-group">
			<Slider
				bind:value={$animationSpeed}
				min={0.5}
				max={2}
				step={0.5}
				label="Speed"
			/>
			<span class="speed-label">{$animationSpeed}x</span>
		</div>

		<div class="action-buttons">
			<button
				class="action-btn start"
				on:click={startAnimation}
				disabled={$isAnimating}
			>
				▶️ Start Flow
			</button>
			<button class="action-btn stop" on:click={stopAnimation} disabled={!$isAnimating}>
				⏹️ Stop
			</button>
		</div>
	</div>

	<!-- Info Section -->
	<div class="info-section">
		<h4 class="text-sm font-semibold text-gray-700 mb-2">About</h4>
		<p class="text-xs text-gray-600 leading-relaxed">
			Explore how .NET microservices work in Kubernetes. Select a scenario and watch
			requests flow through the architecture.
		</p>
	</div>
</div>

<style lang="scss">
	.control-panel {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}

	.scenarios {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.scenario-btn {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
		padding: 0.75rem;
		background: white;
		border: 2px solid #e5e7eb;
		border-radius: 8px;
		cursor: pointer;
		transition: all 0.2s;
		text-align: left;

		&:hover {
			border-color: #3b82f6;
			background: #f0f9ff;
		}

		&.active {
			border-color: #3b82f6;
			background: #dbeafe;
		}
	}

	.scenario-label {
		font-size: 0.875rem;
		font-weight: 600;
		color: #374151;
	}

	.scenario-desc {
		font-size: 0.75rem;
		color: #6b7280;
	}

	.controls-section {
		padding: 1rem;
		background: #f9fafb;
		border-radius: 8px;
		border: 1px solid #e5e7eb;
	}

	.control-group {
		display: flex;
		align-items: center;
		gap: 1rem;
		margin-bottom: 1rem;
	}

	.speed-label {
		font-size: 0.875rem;
		font-weight: 600;
		color: #374151;
		min-width: 40px;
	}

	.action-buttons {
		display: flex;
		gap: 0.5rem;
	}

	.action-btn {
		flex: 1;
		padding: 0.6rem;
		border-radius: 6px;
		font-size: 0.875rem;
		font-weight: 500;
		cursor: pointer;
		transition: all 0.2s;
		border: none;

		&.start {
			background: #10b981;
			color: white;

			&:hover:not(:disabled) {
				background: #059669;
			}

			&:disabled {
				background: #d1d5db;
				cursor: not-allowed;
			}
		}

		&.stop {
			background: #ef4444;
			color: white;

			&:hover:not(:disabled) {
				background: #dc2626;
			}

			&:disabled {
				background: #d1d5db;
				cursor: not-allowed;
			}
		}
	}

	.info-section {
		padding: 1rem;
		background: #eff6ff;
		border-radius: 8px;
		border: 1px solid #bfdbfe;
	}
</style>
