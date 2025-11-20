/**
 * Type definitions for Kubernetes .NET Architecture Explainer
 */

export interface KubernetesComponent {
	id: string;
	name: string;
	type: ComponentType;
	position: { x: number; y: number };
	size: { width: number; height: number };
	icon?: string;
	color?: string;
	children?: KubernetesComponent[];
}

export type ComponentType =
	| 'client'
	| 'ingress'
	| 'api-gateway'
	| 'identity-provider'
	| 'saga-orchestration'
	| 'worker-node'
	| 'pod'
	| 'container'
	| 'kestrel'
	| 'aspnet-pipeline'
	| 'app-logic'
	| 'ef-core'
	| 'database'
	| 'outbox-table'
	| 'message-broker'
	| 'consumer'
	| 'target-service'
	| 'observability';

export interface RequestFlow {
	id: string;
	path: string[];
	currentStep: number;
	data: RequestData;
	timestamp: number;
}

export interface RequestData {
	method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
	endpoint: string;
	headers: Record<string, string>;
	body?: any;
	userId?: string;
	traceId: string;
	spanId: string;
}

export interface Metrics {
	cpu: number; // percentage
	memory: number; // percentage
	requests: number;
	latency: number; // ms
	errorRate?: number; // percentage
}

export interface DatabaseMetrics {
	connections: number;
	transactions: number;
	outboxMessages: number;
	avgQueryTime?: number;
}

export interface MessageBrokerMetrics {
	published: number;
	consumed: number;
	pending: number;
	deadLetters?: number;
}

export interface DeploymentConfig {
	replicas: number;
	cpu: string;
	memory: string;
	autoScaling: boolean;
	minReplicas: number;
	maxReplicas: number;
	targetCPU: number;
}

export interface TraceSpan {
	spanId: string;
	parentSpanId?: string;
	name: string;
	service: string;
	startTime: number;
	duration: number;
	attributes: Record<string, any>;
}

export interface LogEntry {
	timestamp: number;
	level: 'debug' | 'info' | 'warn' | 'error';
	message: string;
	component: string;
	traceId?: string;
	spanId?: string;
}
