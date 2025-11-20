/**
 * Kubernetes .NET Architecture Explainer - Store
 * Manages state for the Kubernetes/Cloud architecture visualization
 *
 * @module store
 */

import { writable, derived } from 'svelte/store';
import type { RequestFlow, Metrics, DatabaseMetrics, MessageBrokerMetrics, DeploymentConfig } from '../types/kubernetes';
import { REQUEST_SCENARIOS } from '../utils/requestFlow';

/**
 * Currently active request flow (null when no request is active)
 */
export const activeRequest = writable<RequestFlow | null>(null);

/**
 * Selected component ID for detailed view
 */
export const selectedComponent = writable<string | null>(null);

/**
 * Visibility toggles for different architecture layers
 */
export const layerVisibility = writable({
	external: true,
	ingress: true,
	apiGateway: true,
	identity: true,
	orchestration: true,
	workerNode: true,
	pod: true,
	application: true,
	database: true,
	messageBroker: true,
	consumers: true,
	observability: true,
	telemetry: true
});

/**
 * Animation state
 */
export const isAnimating = writable<boolean>(false);

/**
 * Animation speed multiplier (0.5x, 1x, 2x)
 */
export const animationSpeed = writable<number>(1);

/**
 * Real-time metrics (updated by MetricsCollector)
 */
export const metrics = writable<{
	pod: Metrics;
	database: DatabaseMetrics;
	messageBroker: MessageBrokerMetrics;
	apiGateway: {
		totalRequests: number;
		successRate: number;
		avgLatency: number;
	};
}>({
	pod: {
		cpu: 45,
		memory: 62,
		requests: 1247,
		latency: 125,
		errorRate: 0
	},
	database: {
		connections: 23,
		transactions: 5420,
		outboxMessages: 15,
		avgQueryTime: 35
	},
	messageBroker: {
		published: 342,
		consumed: 338,
		pending: 4,
		deadLetters: 0
	},
	apiGateway: {
		totalRequests: 12847,
		successRate: 99.2,
		avgLatency: 145
	}
});

/**
 * Example request scenarios (from requestFlow utility)
 */
export const exampleRequests = REQUEST_SCENARIOS;

/**
 * Currently selected example index
 */
export const selectedExampleIdx = writable<number>(0);

/**
 * Currently selected example (derived from index)
 */
export const currentExample = derived(
	selectedExampleIdx,
	($selectedExampleIdx) => exampleRequests[$selectedExampleIdx]
);

/**
 * Currently expanded layer ID
 */
export const expandedLayer = writable<string | null>(null);

/**
 * Currently hovered component ID
 */
export const hoveredComponent = writable<string | null>(null);

/**
 * Show/hide metrics panel
 */
export const showMetrics = writable<boolean>(true);

/**
 * Show/hide distributed tracing visualization
 */
export const showTracing = writable<boolean>(true);

/**
 * Kubernetes deployment configuration
 */
export const deploymentConfig = writable<DeploymentConfig>({
	replicas: 3,
	cpu: '500m',
	memory: '512Mi',
	autoScaling: true,
	minReplicas: 2,
	maxReplicas: 10,
	targetCPU: 70
});

/**
 * Kubernetes cluster metadata
 */
export const kubernetesMetadata = {
	namespace: 'production',
	clusterName: 'aks-prod-cluster',
	region: 'eastus',
	version: '1.28.0'
} as const;

/**
 * Resets all stores to initial state
 * Used when switching explainers or resetting the visualization
 */
export function resetStores(): void {
	activeRequest.set(null);
	selectedComponent.set(null);
	selectedExampleIdx.set(0);
	expandedLayer.set(null);
	hoveredComponent.set(null);
	isAnimating.set(false);
	animationSpeed.set(1);
	showMetrics.set(true);
	showTracing.set(true);
}
