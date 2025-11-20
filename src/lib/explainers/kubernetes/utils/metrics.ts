/**
 * Kubernetes Metrics Collector
 * Provides realistic metric simulation with proper patterns
 *
 * @module utils/metrics
 */

import type {
	Metrics,
	DatabaseMetrics,
	MessageBrokerMetrics
} from '../types/kubernetes';
import { METRICS_CONFIG, POD_RESOURCES } from '../constants/kubernetes';

/**
 * Generates a realistic metric value that fluctuates around a baseline
 *
 * @param baseline - The baseline value
 * @param volatility - How much the value can fluctuate (0-1)
 * @param min - Minimum allowed value
 * @param max - Maximum allowed value
 * @returns Simulated metric value
 */
function generateRealisticValue(
	baseline: number,
	volatility: number,
	min: number,
	max: number
): number {
	// Use sine wave + random noise for realistic fluctuation
	const time = Date.now() / 1000;
	const sineComponent = Math.sin(time / 10) * volatility * baseline;
	const randomComponent = (Math.random() - 0.5) * 2 * volatility * baseline;

	const value = baseline + sineComponent + randomComponent;
	return Math.max(min, Math.min(max, value));
}

/**
 * Generates realistic latency with occasional spikes
 *
 * @param mean - Mean latency in milliseconds
 * @param stdDev - Standard deviation
 * @returns Simulated latency value
 */
function generateLatency(mean: number, stdDev: number): number {
	// Box-Muller transform for normal distribution
	const u1 = Math.random();
	const u2 = Math.random();
	const z0 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);

	// Occasional spike (5% chance)
	const spike = Math.random() < 0.05 ? mean * 2 : 0;

	const latency = mean + z0 * stdDev + spike;
	return Math.max(1, Math.round(latency));
}

/**
 * MetricsCollector class
 * Manages collection and simulation of all system metrics
 */
export class MetricsCollector {
	private intervalId: NodeJS.Timer | null = null;
	private lastUpdateTime: number = Date.now();
	private cumulativeRequests: number = 0;
	private cumulativeTransactions: number = 0;
	private cumulativeMessages: number = 0;

	/**
	 * Collects current pod metrics
	 *
	 * @returns Pod metrics object
	 */
	collectPodMetrics(): Metrics {
		const { BASELINE, VOLATILITY } = METRICS_CONFIG;
		const { CPU, MEMORY } = POD_RESOURCES;

		const cpu = Math.round(
			generateRealisticValue(
				BASELINE.CPU_PERCENT,
				VOLATILITY.CPU,
				CPU.MIN_PERCENT,
				CPU.MAX_PERCENT
			)
		);

		const memory = Math.round(
			generateRealisticValue(
				BASELINE.MEMORY_PERCENT,
				VOLATILITY.MEMORY,
				MEMORY.MIN_PERCENT,
				MEMORY.MAX_PERCENT
			)
		);

		const latency = generateLatency(BASELINE.LATENCY_MS, 30);

		// Calculate requests based on time delta
		const now = Date.now();
		const deltaSeconds = (now - this.lastUpdateTime) / 1000;
		const requestsInPeriod = Math.round(BASELINE.REQUESTS_PER_SEC * deltaSeconds);
		this.cumulativeRequests += requestsInPeriod;

		return {
			cpu,
			memory,
			requests: this.cumulativeRequests,
			latency,
			errorRate: Math.random() < 0.01 ? Math.random() * 2 : 0 // 1% chance of errors
		};
	}

	/**
	 * Collects current database metrics
	 *
	 * @returns Database metrics object
	 */
	collectDatabaseMetrics(): DatabaseMetrics {
		const { BASELINE, VOLATILITY } = METRICS_CONFIG;

		const connections = Math.round(
			generateRealisticValue(BASELINE.DB_CONNECTIONS, 0.15, 5, 100)
		);

		const now = Date.now();
		const deltaSeconds = (now - this.lastUpdateTime) / 1000;
		const transactionsInPeriod = Math.round(
			BASELINE.DB_TRANSACTIONS_PER_SEC * deltaSeconds
		);
		this.cumulativeTransactions += transactionsInPeriod;

		const outboxMessages = Math.round(
			generateRealisticValue(15, 0.3, 0, 50)
		);

		const avgQueryTime = generateLatency(35, 15);

		return {
			connections,
			transactions: this.cumulativeTransactions,
			outboxMessages,
			avgQueryTime
		};
	}

	/**
	 * Collects current message broker metrics
	 *
	 * @returns Message broker metrics object
	 */
	collectMessageBrokerMetrics(): MessageBrokerMetrics {
		const { BASELINE } = METRICS_CONFIG;

		const now = Date.now();
		const deltaSeconds = (now - this.lastUpdateTime) / 1000;
		const messagesInPeriod = Math.round(
			BASELINE.BROKER_MESSAGES_PER_SEC * deltaSeconds
		);

		this.cumulativeMessages += messagesInPeriod;

		const published = this.cumulativeMessages;
		const consumed = Math.max(0, published - Math.round(Math.random() * 10));
		const pending = published - consumed;
		const deadLetters = Math.random() < 0.02 ? Math.round(Math.random() * 3) : 0;

		return {
			published,
			consumed,
			pending,
			deadLetters
		};
	}

	/**
	 * Starts automatic metric collection at specified interval
	 *
	 * @param callback - Function called with updated metrics
	 * @param interval - Update interval in milliseconds (default 1000)
	 * @throws {Error} If collection is already running
	 */
	startAutoCollection(
		callback: (metrics: {
			pod: Metrics;
			database: DatabaseMetrics;
			messageBroker: MessageBrokerMetrics;
		}) => void,
		interval: number = 1000
	): void {
		if (this.intervalId !== null) {
			throw new Error('Metric collection is already running');
		}

		this.intervalId = setInterval(() => {
			try {
				const metrics = {
					pod: this.collectPodMetrics(),
					database: this.collectDatabaseMetrics(),
					messageBroker: this.collectMessageBrokerMetrics()
				};

				this.lastUpdateTime = Date.now();
				callback(metrics);
			} catch (error) {
				console.error('Error collecting metrics:', error);
				// Continue collecting despite errors
			}
		}, interval);
	}

	/**
	 * Stops automatic metric collection
	 */
	stopAutoCollection(): void {
		if (this.intervalId !== null) {
			clearInterval(this.intervalId);
			this.intervalId = null;
		}
	}

	/**
	 * Resets all cumulative counters
	 */
	reset(): void {
		this.cumulativeRequests = 0;
		this.cumulativeTransactions = 0;
		this.cumulativeMessages = 0;
		this.lastUpdateTime = Date.now();
	}

	/**
	 * Cleanup method - stops collection and resets state
	 */
	destroy(): void {
		this.stopAutoCollection();
		this.reset();
	}
}

/**
 * Singleton instance for global use
 */
export const metricsCollector = new MetricsCollector();
