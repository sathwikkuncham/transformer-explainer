<script lang="ts">
	/**
	 * Request Flow Visualization
	 * Shows animated flow of requests through the system
	 *
	 * @component RequestFlow
	 * @prop {IRequestFlow} request - Current active request flow
	 *
	 * @accessibility
	 * - Live region announces flow progress
	 * - Descriptive labels for screen readers
	 */
	import { onMount, onDestroy } from 'svelte';
	import { fade } from 'svelte/transition';
	import type { RequestFlow as IRequestFlow } from '../types/kubernetes';

	/**
	 * Current active request flow
	 */
	export let request: IRequestFlow;

	let mounted = false;

	onMount(() => {
		mounted = true;
	});

	onDestroy(() => {
		mounted = false;
	});
</script>

{#if request}
	<div
		class="request-flow"
		transition:fade={{ duration: 200 }}
		role="status"
		aria-live="polite"
		aria-label="Request flow in progress"
	>
		<div class="request-info">
			<div class="info-header">
				<span class="text-sm font-semibold">Request in Progress</span>
				<span class="trace-id" aria-label="Trace ID">
					Trace: {request.data.traceId.slice(0, 16)}...
				</span>
			</div>
			<div class="flow-path" role="list" aria-label="Request flow path">
				{#each request.path as step, idx}
					<span
						class="path-step"
						class:active={idx === request.currentStep}
						role="listitem"
						aria-current={idx === request.currentStep ? 'step' : undefined}
						aria-label="{step} - {idx === request.currentStep ? 'current step' : `step ${idx + 1}`}"
					>
						{step}
					</span>
					{#if idx < request.path.length - 1}
						<span class="arrow" aria-hidden="true">→</span>
					{/if}
				{/each}
			</div>
		</div>
	</div>
{/if}

<style lang="scss">
	.request-flow {
		position: fixed;
		top: 20px;
		left: 50%;
		transform: translateX(-50%);
		z-index: 1000;
		background: white;
		padding: 1rem 1.5rem;
		border-radius: 10px;
		box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
		border: 2px solid #3b82f6;
		max-width: 90vw;
		overflow-x: auto;
	}

	.info-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 0.75rem;
		padding-bottom: 0.5rem;
		border-bottom: 1px solid #e5e7eb;
	}

	.trace-id {
		font-size: 0.75rem;
		color: #6b7280;
		font-family: monospace;
	}

	.flow-path {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		flex-wrap: wrap;
	}

	.path-step {
		padding: 0.25rem 0.75rem;
		background: #f3f4f6;
		border-radius: 6px;
		font-size: 0.8rem;
		color: #6b7280;
		transition: all 0.3s;
		min-height: 44px; /* Accessibility: minimum touch target */
		display: flex;
		align-items: center;

		&.active {
			background: #3b82f6;
			color: white;
			font-weight: 600;
			animation: pulse 1.5s ease-in-out infinite;
		}

		&:focus {
			outline: 2px solid #3b82f6;
			outline-offset: 2px;
		}
	}

	.arrow {
		color: #9ca3af;
		font-weight: 300;
	}

	@keyframes pulse {
		0%,
		100% {
			transform: scale(1);
		}
		50% {
			transform: scale(1.1);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.path-step.active {
			animation: none;
		}
	}
</style>
