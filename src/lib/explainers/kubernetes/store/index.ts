/**
 * Kubernetes .NET Architecture Explainer - Store
 * Manages state for the Kubernetes/Cloud architecture visualization
 */

import { writable, derived } from 'svelte/store';

// Request flow state
export const activeRequest = writable<{
	id: string;
	path: string[];
	currentStep: number;
	data: any;
} | null>(null);

// Selected component for detailed view
export const selectedComponent = writable<string | null>(null);

// Visibility toggles for different layers
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

// Animation state
export const isAnimating = writable(false);
export const animationSpeed = writable(1); // 1x, 2x, 0.5x speed

// Component metrics (simulated)
export const metrics = writable({
	pod: {
		cpu: 45,
		memory: 62,
		requests: 1247,
		latency: 125
	},
	database: {
		connections: 23,
		transactions: 5420,
		outboxMessages: 15
	},
	messageBroker: {
		published: 342,
		consumed: 338,
		pending: 4
	},
	apiGateway: {
		totalRequests: 12847,
		successRate: 99.2,
		avgLatency: 145
	}
});

// Request examples
export const exampleRequests = [
	{
		id: 'user-login',
		label: 'User Login',
		description: 'User authentication flow through identity provider',
		path: ['client', 'ingress', 'api-gateway', 'identity', 'response']
	},
	{
		id: 'create-order',
		label: 'Create Order',
		description: 'Full microservice flow with saga orchestration',
		path: [
			'client',
			'ingress',
			'api-gateway',
			'identity',
			'saga',
			'pod',
			'app-logic',
			'ef-core',
			'database',
			'outbox',
			'message-broker',
			'consumer',
			'target-service',
			'observability',
			'response'
		]
	},
	{
		id: 'health-check',
		label: 'Health Check',
		description: 'Kubernetes liveness/readiness probe',
		path: ['kubelet', 'pod', 'app-logic', 'response']
	},
	{
		id: 'async-message',
		label: 'Async Message Processing',
		description: 'Message-driven architecture flow',
		path: ['message-broker', 'consumer', 'app-logic', 'database', 'outbox']
	}
];

export const selectedExampleIdx = writable(0);

// Current example
export const currentExample = derived(
	selectedExampleIdx,
	($selectedExampleIdx) => exampleRequests[$selectedExampleIdx]
);

// UI state
export const expandedLayer = writable<string | null>(null);
export const hoveredComponent = writable<string | null>(null);
export const showMetrics = writable(true);
export const showTracing = writable(true);

// Deployment configuration
export const deploymentConfig = writable({
	replicas: 3,
	cpu: '500m',
	memory: '512Mi',
	autoScaling: true,
	minReplicas: 2,
	maxReplicas: 10,
	targetCPU: 70
});

// Kubernetes metadata
export const kubernetesMetadata = {
	namespace: 'production',
	clusterName: 'aks-prod-cluster',
	region: 'eastus',
	version: '1.28.0'
};

// Reset all stores
export function resetStores() {
	activeRequest.set(null);
	selectedComponent.set(null);
	selectedExampleIdx.set(0);
	expandedLayer.set(null);
	hoveredComponent.set(null);
	isAnimating.set(false);
	animationSpeed.set(1);
}
