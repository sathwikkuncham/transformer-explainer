<script lang="ts">
	/**
	 * @fileoverview Kubernetes .NET Architecture Explainer - Main Component
	 *
	 * This is the primary container component for the Kubernetes .NET architecture visualization.
	 * It orchestrates the entire interactive experience including:
	 * - Real-time metrics collection and display
	 * - Request flow animations through microservices
	 * - Component interaction and state management
	 * - Responsive layout with control panel, architecture visualization, and metrics
	 *
	 * @module KubernetesMain
	 * @requires svelte/store - For reactive state management
	 * @requires ../utils/metrics - For realistic metrics simulation
	 *
	 * @example
	 * import KubernetesMain from '~/lib/explainers/kubernetes/components/KubernetesMain.svelte';
	 * // Then use in your Svelte template: <KubernetesMain />
	 */
	import { onMount, onDestroy } from 'svelte';
	import { fade, fly } from 'svelte/transition';
	import classNames from 'classnames';

	// Import shared components
	import CommonPopover from '~/lib/shared/components/CommonPopover.svelte';
	import LoadingDots from '~/lib/shared/components/LoadingDots.svelte';

	// Import Kubernetes-specific components
	import ExternalClient from './Layers/ExternalClient.svelte';
	import IngressController from './Layers/IngressController.svelte';
	import ApiGateway from './Layers/ApiGateway.svelte';
	import IdentityProvider from './Layers/IdentityProvider.svelte';
	import SagaOrchestration from './Layers/SagaOrchestration.svelte';
	import WorkerNode from './Layers/WorkerNode.svelte';
	import Database from './Layers/Database.svelte';
	import MessageBroker from './Layers/MessageBroker.svelte';
	import ConsumerServices from './Layers/ConsumerServices.svelte';
	import Observability from './Layers/Observability.svelte';
	import RequestFlow from './RequestFlow.svelte';
	import ControlPanel from './ControlPanel.svelte';
	import MetricsPanel from './MetricsPanel.svelte';

	// Import stores
	import {
		activeRequest,
		selectedComponent,
		expandedLayer,
		isAnimating,
		showMetrics,
		selectedExampleIdx,
		currentExample,
		metrics
	} from '../store';

	// Import utilities
	import { metricsCollector } from '../utils/metrics';

	/**
	 * Component initialization state
	 * @type {boolean}
	 */
	let active = false;

	/**
	 * Error state for error boundary handling
	 * @type {Error | null}
	 */
	let errorState: Error | null = null;

	/**
	 * Container dimensions for responsive calculations
	 * @type {number}
	 */
	let containerHeight = 0;
	let containerWidth = 0;

	/**
	 * Lifecycle: Component mount
	 * Initializes metrics collection and sets up cleanup
	 *
	 * @fires metricsCollector.startAutoCollection - Starts 1-second interval metrics updates
	 * @returns {Function} Cleanup function to stop metrics collection
	 */
	onMount(() => {
		try {
			active = true;

			// Start metrics collection with realistic simulation
			// Uses Box-Muller transform for normal distribution
			// Updates every 1 second with realistic fluctuation
			metricsCollector.startAutoCollection((collectedMetrics) => {
				try {
					metrics.set(collectedMetrics);
				} catch (error) {
					console.error('Error updating metrics:', error);
					errorState = error instanceof Error ? error : new Error(String(error));
				}
			}, 1000);

			return () => {
				// Cleanup: Stop metrics collection
				metricsCollector.stopAutoCollection();
			};
		} catch (error) {
			console.error('Error in component initialization:', error);
			errorState = error instanceof Error ? error : new Error(String(error));
		}
	});

	/**
	 * Lifecycle: Component destroy
	 * Ensures cleanup even if onMount cleanup doesn't run
	 */
	onDestroy(() => {
		try {
			metricsCollector.stopAutoCollection();
		} catch (error) {
			console.error('Error during cleanup:', error);
		}
	});

	/**
	 * Handles component selection/deselection
	 * Toggles component highlighting and detail view
	 *
	 * @param {string} componentId - The ID of the component to select
	 * @example
	 * handleComponentClick('api-gateway') // Selects API Gateway
	 * handleComponentClick('api-gateway') // Deselects if already selected
	 */
	function handleComponentClick(componentId: string): void {
		try {
			if ($selectedComponent === componentId) {
				selectedComponent.set(null);
			} else {
				selectedComponent.set(componentId);
			}
		} catch (error) {
			console.error('Error handling component click:', error);
		}
	}

	/**
	 * Handles layer expansion/collapse
	 * Used for expandable layers like WorkerNode
	 *
	 * @param {string} layerId - The ID of the layer to expand/collapse
	 * @example
	 * handleLayerExpand('worker') // Expands worker node to show pods
	 */
	function handleLayerExpand(layerId: string): void {
		if ($expandedLayer === layerId) {
			expandedLayer.set(null);
		} else {
			expandedLayer.set(layerId);
		}
	}
</script>

<div
	class="kubernetes-explainer"
	class:active
	bind:offsetHeight={containerHeight}
	bind:offsetWidth={containerWidth}
>
	<!-- Error Boundary -->
	{#if errorState}
		<div class="error-boundary" role="alert" aria-live="assertive">
			<div class="error-content">
				<div class="error-icon">⚠️</div>
				<h2 class="error-title">Something went wrong</h2>
				<p class="error-message">
					We encountered an error while loading the Kubernetes explainer.
				</p>
				<details class="error-details">
					<summary>Technical details</summary>
					<pre class="error-stack">{errorState.message}</pre>
				</details>
				<button
					class="error-retry"
					on:click={() => {
						errorState = null;
						window.location.reload();
					}}
				>
					Reload Page
				</button>
			</div>
		</div>
	{:else}
		<!-- Header -->
		<div class="header">
		<div class="flex items-center gap-3">
			<span class="text-3xl">☸️</span>
			<div>
				<h1 class="text-2xl font-bold text-gray-800">.NET on Kubernetes</h1>
				<p class="text-sm text-gray-500">
					Interactive Cloud Architecture Visualization
				</p>
			</div>
		</div>
	</div>

	<!-- Main Content -->
	<div class="main-content">
		<!-- Left Sidebar - Control Panel -->
		<div class="sidebar left">
			<ControlPanel />
		</div>

		<!-- Center - Architecture Visualization -->
		<div class="architecture-container">
			{#if !active}
				<div class="loading-container">
					<LoadingDots />
					<p class="text-gray-500 mt-4">Loading architecture...</p>
				</div>
			{:else}
				<div class="architecture-grid" transition:fade={{ duration: 500 }}>
					<!-- External Layer -->
					<div class="layer external-layer">
						<ExternalClient on:click={() => handleComponentClick('external')} />
					</div>

					<!-- Kubernetes Cluster Boundary -->
					<div class="cluster-boundary">
						<div class="cluster-label">
							<span class="text-xs font-semibold text-blue-600"
								>☸️ Kubernetes Cluster</span
							>
						</div>

						<!-- Ingress Layer -->
						<div class="layer ingress-layer">
							<IngressController on:click={() => handleComponentClick('ingress')} />
						</div>

						<!-- API Gateway & Services Layer -->
						<div class="layer services-layer">
							<div class="flex gap-4 justify-center">
								<ApiGateway on:click={() => handleComponentClick('api-gateway')} />
								<IdentityProvider
									on:click={() => handleComponentClick('identity')}
								/>
								<SagaOrchestration on:click={() => handleComponentClick('saga')} />
							</div>
						</div>

						<!-- Worker Node Layer -->
						<div class="layer worker-layer">
							<WorkerNode
								on:click={() => handleComponentClick('worker')}
								on:expand={() => handleLayerExpand('worker')}
								expanded={$expandedLayer === 'worker'}
							/>
						</div>

						<!-- Data & Messaging Layer -->
						<div class="layer data-layer">
							<div class="flex gap-4 justify-center">
								<Database on:click={() => handleComponentClick('database')} />
								<MessageBroker
									on:click={() => handleComponentClick('message-broker')}
								/>
							</div>
						</div>

						<!-- Consumer Services Layer -->
						<div class="layer consumer-layer">
							<ConsumerServices on:click={() => handleComponentClick('consumer')} />
						</div>
					</div>

					<!-- Observability Layer (External to cluster) -->
					<div class="layer observability-layer">
						<Observability on:click={() => handleComponentClick('observability')} />
					</div>

					<!-- Request Flow Visualization Overlay -->
					{#if $activeRequest}
						<div class="request-flow-overlay" transition:fade={{ duration: 200 }}>
							<RequestFlow request={$activeRequest} />
						</div>
					{/if}
				</div>
			{/if}
		</div>

		<!-- Right Sidebar - Metrics Panel -->
		{#if $showMetrics}
			<div class="sidebar right" transition:fly={{ x: 300, duration: 300 }}>
				<MetricsPanel />
			</div>
		{/if}
	</div>

	<!-- Bottom Info Bar -->
	<div class="info-bar">
		<div class="flex items-center gap-6 text-sm">
			<div class="flex items-center gap-2">
				<span class="w-3 h-3 bg-green-500 rounded-full animate-pulse"></span>
				<span class="text-gray-600">Cluster: aks-prod-cluster</span>
			</div>
			<div class="text-gray-500">Namespace: production</div>
			<div class="text-gray-500">Region: East US</div>
			{#if $isAnimating}
				<div class="flex items-center gap-2 text-blue-600">
					<LoadingDots />
					<span>Request flowing...</span>
				</div>
			{/if}
		</div>
		{#if $currentExample}
			<div class="text-sm text-gray-600">
				Current: <span class="font-semibold">{$currentExample.label}</span>
			</div>
		{/if}
	</div>
	{/if}
</div>

<style lang="scss">
	/* Error Boundary Styles */
	.error-boundary {
		display: flex;
		align-items: center;
		justify-content: center;
		min-height: 100vh;
		background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%);
		padding: 2rem;
	}

	.error-content {
		background: white;
		border-radius: 12px;
		padding: 2rem;
		max-width: 600px;
		box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
		text-align: center;
	}

	.error-icon {
		font-size: 4rem;
		margin-bottom: 1rem;
	}

	.error-title {
		font-size: 1.5rem;
		font-weight: 700;
		color: #991b1b;
		margin-bottom: 0.5rem;
	}

	.error-message {
		color: #6b7280;
		margin-bottom: 1.5rem;
		line-height: 1.6;
	}

	.error-details {
		text-align: left;
		background: #f9fafb;
		border-radius: 6px;
		padding: 1rem;
		margin-bottom: 1.5rem;
		border: 1px solid #e5e7eb;

		summary {
			cursor: pointer;
			font-weight: 600;
			color: #374151;
			user-select: none;

			&:hover {
				color: #1f2937;
			}
		}
	}

	.error-stack {
		margin-top: 0.75rem;
		padding: 0.75rem;
		background: white;
		border-radius: 4px;
		font-size: 0.875rem;
		color: #dc2626;
		overflow-x: auto;
		border: 1px solid #fecaca;
	}

	.error-retry {
		background: #ef4444;
		color: white;
		padding: 0.75rem 2rem;
		border-radius: 6px;
		border: none;
		font-weight: 600;
		cursor: pointer;
		transition: all 0.2s;

		&:hover {
			background: #dc2626;
			transform: translateY(-1px);
			box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
		}

		&:active {
			transform: translateY(0);
		}
	}

	/* Existing Styles */
	.kubernetes-explainer {
		height: 100vh;
		width: 100vw;
		display: flex;
		flex-direction: column;
		background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
		opacity: 0;
		transition: opacity 0.5s;

		&.active {
			opacity: 1;
		}
	}

	.header {
		background: white;
		border-bottom: 2px solid #e5e7eb;
		padding: 1rem 2rem;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
	}

	.main-content {
		flex: 1;
		display: grid;
		grid-template-columns: 250px 1fr 300px;
		gap: 1rem;
		padding: 1rem;
		overflow: hidden;
		min-height: 0;
	}

	.sidebar {
		background: white;
		border-radius: 12px;
		padding: 1.5rem;
		box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
		overflow-y: auto;

		&.left {
			grid-column: 1;
		}

		&.right {
			grid-column: 3;
		}
	}

	.architecture-container {
		grid-column: 2;
		background: white;
		border-radius: 12px;
		box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
		overflow: auto;
		position: relative;
		padding: 2rem;
	}

	.loading-container {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		height: 100%;
	}

	.architecture-grid {
		display: flex;
		flex-direction: column;
		gap: 2rem;
		min-height: 100%;
		position: relative;
	}

	.layer {
		position: relative;
		transition: all 0.3s ease;

		&:hover {
			transform: translateY(-2px);
		}
	}

	.cluster-boundary {
		border: 3px dashed #3b82f6;
		border-radius: 16px;
		padding: 2rem;
		background: rgba(59, 130, 246, 0.02);
		position: relative;
		display: flex;
		flex-direction: column;
		gap: 2rem;
	}

	.cluster-label {
		position: absolute;
		top: -12px;
		left: 20px;
		background: white;
		padding: 0 8px;
		border-radius: 4px;
	}

	.external-layer {
		display: flex;
		justify-content: center;
	}

	.ingress-layer,
	.services-layer,
	.worker-layer,
	.data-layer,
	.consumer-layer,
	.observability-layer {
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.request-flow-overlay {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		pointer-events: none;
		z-index: 1000;
	}

	.info-bar {
		background: white;
		border-top: 2px solid #e5e7eb;
		padding: 0.75rem 2rem;
		display: flex;
		justify-content: space-between;
		align-items: center;
		box-shadow: 0 -2px 4px rgba(0, 0, 0, 0.05);
	}

	@keyframes pulse {
		0%,
		100% {
			opacity: 1;
		}
		50% {
			opacity: 0.5;
		}
	}

	.animate-pulse {
		animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
	}

	/* Responsive adjustments */
	@media (max-width: 1280px) {
		.main-content {
			grid-template-columns: 220px 1fr 280px;
		}
	}

	@media (max-width: 1024px) {
		.main-content {
			grid-template-columns: 1fr;
			grid-template-rows: auto 1fr auto;
		}

		.sidebar.left {
			grid-column: 1;
			grid-row: 1;
		}

		.architecture-container {
			grid-column: 1;
			grid-row: 2;
		}

		.sidebar.right {
			grid-column: 1;
			grid-row: 3;
		}
	}
</style>
