/**
 * Kubernetes Architecture Explainer - Constants
 * All magic numbers and configuration values centralized here
 *
 * @module constants/kubernetes
 */

/**
 * Core Kubernetes configuration constants
 */
export const KUBERNETES_CONSTANTS = {
	/** Health check interval in milliseconds */
	HEALTH_CHECK_INTERVAL: 5000,

	/** Metrics update interval in milliseconds */
	METRICS_UPDATE_INTERVAL: 1000,

	/** Default animation duration in milliseconds */
	ANIMATION_DURATION: 3000,

	/** Maximum number of traces to retain in memory */
	MAX_TRACE_RETENTION: 100,

	/** Default timeout for operations in milliseconds */
	DEFAULT_TIMEOUT: 30000,

	/** Maximum retry attempts for failed operations */
	MAX_RETRIES: 3,

	/** Retry backoff base in milliseconds */
	RETRY_BACKOFF_BASE: 1000,
} as const;

/**
 * Realistic latency profiles for each component type
 * Values in milliseconds: { min, max, mean }
 */
export const COMPONENT_LATENCIES = {
	INGRESS: { min: 5, max: 15, mean: 8, stdDev: 3 },
	API_GATEWAY: { min: 10, max: 30, mean: 18, stdDev: 5 },
	IDENTITY_PROVIDER: { min: 50, max: 150, mean: 85, stdDev: 25 },
	SAGA_ORCHESTRATION: { min: 20, max: 60, mean: 35, stdDev: 10 },
	POD_PROCESSING: { min: 30, max: 100, mean: 55, stdDev: 20 },
	DATABASE_QUERY: { min: 15, max: 80, mean: 35, stdDev: 15 },
	DATABASE_WRITE: { min: 20, max: 100, mean: 50, stdDev: 20 },
	MESSAGE_BROKER_PUBLISH: { min: 5, max: 20, mean: 10, stdDev: 4 },
	MESSAGE_BROKER_CONSUME: { min: 8, max: 25, mean: 12, stdDev: 5 },
	CONSUMER_SERVICE: { min: 25, max: 90, mean: 45, stdDev: 18 },
} as const;

/**
 * Animation easing functions compatible with GSAP
 */
export const ANIMATION_EASING = {
	DEFAULT: 'power2.out',
	SMOOTH: 'power1.inOut',
	BOUNCE: 'back.out(1.7)',
	ELASTIC: 'elastic.out(1, 0.3)',
} as const;

/**
 * Component colors for consistent theming
 */
export const COMPONENT_COLORS = {
	EXTERNAL: '#6B7280',
	INGRESS: '#F97316',
	API_GATEWAY: '#3B82F6',
	IDENTITY: '#A855F7',
	SAGA: '#22C55E',
	WORKER_NODE: '#94A3B8',
	POD: '#3B82F6',
	DATABASE: '#F59E0B',
	MESSAGE_BROKER: '#EC4899',
	CONSUMER: '#14B8A6',
	OBSERVABILITY: '#8B5CF6',
} as const;

/**
 * Kubernetes namespaces
 */
export const NAMESPACES = {
	PRODUCTION: 'production',
	STAGING: 'staging',
	DEVELOPMENT: 'development',
	SYSTEM: 'kube-system',
} as const;

/**
 * Pod resource limits and requests
 */
export const POD_RESOURCES = {
	CPU: {
		REQUEST: '500m',
		LIMIT: '1000m',
		MIN_PERCENT: 20,
		MAX_PERCENT: 95,
		WARNING_THRESHOLD: 80,
	},
	MEMORY: {
		REQUEST: '512Mi',
		LIMIT: '1Gi',
		MIN_PERCENT: 30,
		MAX_PERCENT: 90,
		WARNING_THRESHOLD: 85,
	},
} as const;

/**
 * Metric collection configuration
 */
export const METRICS_CONFIG = {
	/** How often metrics fluctuate (lower = more stable) */
	VOLATILITY: {
		CPU: 0.15,
		MEMORY: 0.08,
		LATENCY: 0.25,
		THROUGHPUT: 0.20,
	},

	/** Baseline values for realistic simulation */
	BASELINE: {
		CPU_PERCENT: 45,
		MEMORY_PERCENT: 62,
		REQUESTS_PER_SEC: 120,
		LATENCY_MS: 125,
		DB_CONNECTIONS: 23,
		DB_TRANSACTIONS_PER_SEC: 90,
		BROKER_MESSAGES_PER_SEC: 50,
	},
} as const;

/**
 * Health check configuration
 */
export const HEALTH_CHECK_CONFIG = {
	/** Liveness probe configuration */
	LIVENESS: {
		INITIAL_DELAY_SECONDS: 30,
		PERIOD_SECONDS: 10,
		TIMEOUT_SECONDS: 5,
		FAILURE_THRESHOLD: 3,
	},

	/** Readiness probe configuration */
	READINESS: {
		INITIAL_DELAY_SECONDS: 10,
		PERIOD_SECONDS: 5,
		TIMEOUT_SECONDS: 3,
		FAILURE_THRESHOLD: 2,
	},
} as const;

/**
 * Z-index layers for proper stacking
 */
export const Z_INDEX = {
	BASE: 1,
	COMPONENT: 10,
	COMPONENT_HOVER: 20,
	FLOW_OVERLAY: 100,
	REQUEST_FLOW: 1000,
	MODAL: 2000,
	TOOLTIP: 3000,
} as const;

/**
 * Accessibility configuration
 */
export const A11Y_CONFIG = {
	/** Minimum touch target size in pixels */
	MIN_TOUCH_TARGET: 44,

	/** Focus outline width in pixels */
	FOCUS_OUTLINE_WIDTH: 2,

	/** Animation duration for reduce-motion users in milliseconds */
	REDUCED_MOTION_DURATION: 0,
} as const;
