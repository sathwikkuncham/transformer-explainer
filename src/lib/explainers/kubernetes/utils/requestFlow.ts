/**
 * Request Flow Engine
 * Simulates realistic request flows through Kubernetes architecture
 *
 * @module utils/requestFlow
 */

import type { RequestFlow, RequestData, TraceSpan } from '../types/kubernetes';
import { COMPONENT_LATENCIES } from '../constants/kubernetes';

/**
 * Generates a unique trace ID following OpenTelemetry format
 *
 * @returns 32-character hex string trace ID
 */
export function generateTraceId(): string {
	const timestamp = Date.now().toString(16).padStart(16, '0');
	const random = Math.random().toString(16).slice(2, 18).padStart(16, '0');
	return `${timestamp}${random}`;
}

/**
 * Generates a unique span ID following OpenTelemetry format
 *
 * @param parentSpanId - Optional parent span ID for creating child spans
 * @returns 16-character hex string span ID
 */
export function generateSpanId(parentSpanId?: string): string {
	const random = Math.random().toString(16).slice(2, 18).padStart(16, '0');
	return random;
}

/**
 * Calculates realistic latency for a component type
 *
 * @param componentType - Type of component (e.g., 'INGRESS', 'POD_PROCESSING')
 * @returns Latency in milliseconds
 */
export function calculateComponentLatency(
	componentType: keyof typeof COMPONENT_LATENCIES
): number {
	const config = COMPONENT_LATENCIES[componentType];
	if (!config) {
		return 50; // Default fallback
	}

	const { min, max, mean, stdDev } = config;

	// Box-Muller transform for normal distribution
	const u1 = Math.random();
	const u2 = Math.random();
	const z0 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);

	const latency = mean + z0 * stdDev;

	// Clamp to min/max
	return Math.max(min, Math.min(max, Math.round(latency)));
}

/**
 * Request scenario definition
 */
export interface RequestScenario {
	id: string;
	label: string;
	description: string;
	method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
	endpoint: string;
	path: Array<{
		component: string;
		latencyType: keyof typeof COMPONENT_LATENCIES;
		action: string;
	}>;
	body?: unknown;
}

/**
 * Request event emitted during flow simulation
 */
export interface RequestEvent {
	type: 'start' | 'component-enter' | 'component-exit' | 'complete' | 'error';
	timestamp: number;
	component?: string;
	latency?: number;
	data?: unknown;
	error?: Error;
}

/**
 * RequestFlowEngine class
 * Manages request flow simulation through the architecture
 */
export class RequestFlowEngine {
	private activeFlows: Map<string, RequestFlow> = new Map();

	/**
	 * Starts a new request flow simulation
	 *
	 * @param scenario - Request scenario to simulate
	 * @param onEvent - Callback for flow events
	 * @returns Promise that resolves with final request data
	 */
	async simulateRequest(
		scenario: RequestScenario,
		onEvent: (event: RequestEvent) => void
	): Promise<RequestData> {
		const traceId = generateTraceId();
		const spanId = generateSpanId();

		const requestData: RequestData = {
			method: scenario.method,
			endpoint: scenario.endpoint,
			headers: {
				'Content-Type': 'application/json',
				'X-Trace-Id': traceId,
				'X-Span-Id': spanId,
				'User-Agent': 'KubernetesExplainer/1.0'
			},
			body: scenario.body,
			traceId,
			spanId
		};

		const flow: RequestFlow = {
			id: traceId,
			path: scenario.path.map((p) => p.component),
			currentStep: 0,
			data: requestData,
			timestamp: Date.now()
		};

		this.activeFlows.set(traceId, flow);

		// Emit start event
		onEvent({
			type: 'start',
			timestamp: Date.now(),
			data: requestData
		});

		try {
			// Simulate flow through each component
			for (let i = 0; i < scenario.path.length; i++) {
				const step = scenario.path[i];
				flow.currentStep = i;

				// Emit component enter event
				onEvent({
					type: 'component-enter',
					timestamp: Date.now(),
					component: step.component,
					data: { action: step.action }
				});

				// Calculate and wait for latency
				const latency = calculateComponentLatency(step.latencyType);
				await this.delay(latency);

				// Emit component exit event
				onEvent({
					type: 'component-exit',
					timestamp: Date.now(),
					component: step.component,
					latency,
					data: { action: step.action }
				});
			}

			// Emit complete event
			onEvent({
				type: 'complete',
				timestamp: Date.now(),
				data: requestData
			});

			return requestData;
		} catch (error) {
			// Emit error event
			onEvent({
				type: 'error',
				timestamp: Date.now(),
				error: error as Error
			});

			throw error;
		} finally {
			this.activeFlows.delete(traceId);
		}
	}

	/**
	 * Gets currently active flows
	 *
	 * @returns Map of active flows
	 */
	getActiveFlows(): Map<string, RequestFlow> {
		return new Map(this.activeFlows);
	}

	/**
	 * Cancels an active flow
	 *
	 * @param traceId - Trace ID of flow to cancel
	 * @returns true if flow was cancelled, false if not found
	 */
	cancelFlow(traceId: string): boolean {
		return this.activeFlows.delete(traceId);
	}

	/**
	 * Generates a trace span for OpenTelemetry visualization
	 *
	 * @param name - Span name
	 * @param service - Service name
	 * @param duration - Duration in milliseconds
	 * @param parentSpanId - Optional parent span ID
	 * @param attributes - Additional attributes
	 * @returns TraceSpan object
	 */
	generateSpan(
		name: string,
		service: string,
		duration: number,
		parentSpanId?: string,
		attributes: Record<string, unknown> = {}
	): TraceSpan {
		return {
			spanId: generateSpanId(parentSpanId),
			parentSpanId,
			name,
			service,
			startTime: Date.now(),
			duration,
			attributes
		};
	}

	/**
	 * Utility method to delay execution
	 *
	 * @param ms - Milliseconds to delay
	 * @returns Promise that resolves after delay
	 */
	private delay(ms: number): Promise<void> {
		return new Promise((resolve) => setTimeout(resolve, ms));
	}

	/**
	 * Cleanup method
	 */
	destroy(): void {
		this.activeFlows.clear();
	}
}

/**
 * Singleton instance for global use
 */
export const requestFlowEngine = new RequestFlowEngine();

/**
 * Predefined request scenarios
 */
export const REQUEST_SCENARIOS: RequestScenario[] = [
	{
		id: 'user-login',
		label: 'User Login',
		description: 'User authentication flow through identity provider',
		method: 'POST',
		endpoint: '/api/auth/login',
		path: [
			{ component: 'ingress', latencyType: 'INGRESS', action: 'Route request' },
			{
				component: 'api-gateway',
				latencyType: 'API_GATEWAY',
				action: 'Validate and route'
			},
			{
				component: 'identity',
				latencyType: 'IDENTITY_PROVIDER',
				action: 'Authenticate user'
			}
		],
		body: { username: 'demo-user', password: '***' }
	},
	{
		id: 'create-order',
		label: 'Create Order',
		description: 'Full microservice flow with saga orchestration',
		method: 'POST',
		endpoint: '/api/orders',
		path: [
			{ component: 'ingress', latencyType: 'INGRESS', action: 'Route request' },
			{
				component: 'api-gateway',
				latencyType: 'API_GATEWAY',
				action: 'Validate and route'
			},
			{ component: 'identity', latencyType: 'IDENTITY_PROVIDER', action: 'Verify token' },
			{
				component: 'saga',
				latencyType: 'SAGA_ORCHESTRATION',
				action: 'Initiate saga'
			},
			{ component: 'pod', latencyType: 'POD_PROCESSING', action: 'Process order' },
			{ component: 'database', latencyType: 'DATABASE_WRITE', action: 'Save order' },
			{
				component: 'database',
				latencyType: 'DATABASE_WRITE',
				action: 'Write to outbox'
			},
			{
				component: 'message-broker',
				latencyType: 'MESSAGE_BROKER_PUBLISH',
				action: 'Publish event'
			},
			{
				component: 'consumer',
				latencyType: 'MESSAGE_BROKER_CONSUME',
				action: 'Consume event'
			},
			{
				component: 'consumer',
				latencyType: 'CONSUMER_SERVICE',
				action: 'Process event'
			}
		],
		body: { items: [{ id: 1, quantity: 2 }], totalAmount: 49.99 }
	},
	{
		id: 'health-check',
		label: 'Health Check',
		description: 'Kubernetes liveness/readiness probe',
		method: 'GET',
		endpoint: '/health',
		path: [{ component: 'pod', latencyType: 'POD_PROCESSING', action: 'Health check' }]
	},
	{
		id: 'async-message',
		label: 'Async Message Processing',
		description: 'Message-driven architecture flow',
		method: 'POST',
		endpoint: '/api/events/process',
		path: [
			{
				component: 'message-broker',
				latencyType: 'MESSAGE_BROKER_CONSUME',
				action: 'Consume message'
			},
			{
				component: 'consumer',
				latencyType: 'CONSUMER_SERVICE',
				action: 'Process message'
			},
			{ component: 'database', latencyType: 'DATABASE_WRITE', action: 'Update state' },
			{
				component: 'database',
				latencyType: 'DATABASE_WRITE',
				action: 'Mark as processed'
			}
		]
	}
];
