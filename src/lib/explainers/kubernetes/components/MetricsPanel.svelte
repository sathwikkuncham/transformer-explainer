<script lang="ts">
	/**
	 * Metrics Panel - Displays real-time metrics for various components
	 */
	import { metrics } from '../store';
</script>

<div class="metrics-panel">
	<h3 class="text-lg font-bold text-gray-800 mb-4">Live Metrics</h3>

	<!-- Pod Metrics -->
	<div class="metric-section">
		<h4 class="section-title">Pod Resources</h4>
		<div class="metric-grid">
			<div class="metric-card">
				<div class="metric-label">CPU Usage</div>
				<div class="metric-value">{$metrics.pod.cpu}%</div>
				<div class="metric-bar">
					<div class="bar-fill cpu" style="width: {$metrics.pod.cpu}%"></div>
				</div>
			</div>
			<div class="metric-card">
				<div class="metric-label">Memory</div>
				<div class="metric-value">{$metrics.pod.memory}%</div>
				<div class="metric-bar">
					<div class="bar-fill memory" style="width: {$metrics.pod.memory}%"></div>
				</div>
			</div>
			<div class="metric-card">
				<div class="metric-label">Requests</div>
				<div class="metric-value">{$metrics.pod.requests}</div>
			</div>
			<div class="metric-card">
				<div class="metric-label">Latency</div>
				<div class="metric-value">{$metrics.pod.latency}ms</div>
			</div>
		</div>
	</div>

	<!-- API Gateway Metrics -->
	<div class="metric-section">
		<h4 class="section-title">API Gateway</h4>
		<div class="metric-grid">
			<div class="metric-card">
				<div class="metric-label">Total Requests</div>
				<div class="metric-value">{$metrics.apiGateway.totalRequests}</div>
			</div>
			<div class="metric-card">
				<div class="metric-label">Success Rate</div>
				<div class="metric-value success">{$metrics.apiGateway.successRate}%</div>
			</div>
			<div class="metric-card">
				<div class="metric-label">Avg Latency</div>
				<div class="metric-value">{$metrics.apiGateway.avgLatency}ms</div>
			</div>
		</div>
	</div>

	<!-- Database Metrics -->
	<div class="metric-section">
		<h4 class="section-title">Database</h4>
		<div class="metric-grid">
			<div class="metric-card">
				<div class="metric-label">Active Connections</div>
				<div class="metric-value">{$metrics.database.connections}</div>
			</div>
			<div class="metric-card">
				<div class="metric-label">Transactions</div>
				<div class="metric-value">{$metrics.database.transactions}</div>
			</div>
			<div class="metric-card">
				<div class="metric-label">Outbox Messages</div>
				<div class="metric-value warning">{$metrics.database.outboxMessages}</div>
			</div>
		</div>
	</div>

	<!-- Message Broker Metrics -->
	<div class="metric-section">
		<h4 class="section-title">Message Broker</h4>
		<div class="metric-grid">
			<div class="metric-card">
				<div class="metric-label">Published</div>
				<div class="metric-value">{$metrics.messageBroker.published}</div>
			</div>
			<div class="metric-card">
				<div class="metric-label">Consumed</div>
				<div class="metric-value">{$metrics.messageBroker.consumed}</div>
			</div>
			<div class="metric-card">
				<div class="metric-label">Pending</div>
				<div class="metric-value warning">{$metrics.messageBroker.pending}</div>
			</div>
		</div>
	</div>
</div>

<style lang="scss">
	.metrics-panel {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}

	.metric-section {
		padding: 1rem;
		background: #f9fafb;
		border-radius: 8px;
		border: 1px solid #e5e7eb;
	}

	.section-title {
		font-size: 0.875rem;
		font-weight: 600;
		color: #374151;
		margin-bottom: 0.75rem;
	}

	.metric-grid {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 0.75rem;
	}

	.metric-card {
		padding: 0.75rem;
		background: white;
		border-radius: 6px;
		border: 1px solid #e5e7eb;
	}

	.metric-label {
		font-size: 0.7rem;
		color: #6b7280;
		margin-bottom: 0.25rem;
		text-transform: uppercase;
	}

	.metric-value {
		font-size: 1.25rem;
		font-weight: 700;
		color: #111827;

		&.success {
			color: #10b981;
		}

		&.warning {
			color: #f59e0b;
		}

		&.error {
			color: #ef4444;
		}
	}

	.metric-bar {
		margin-top: 0.5rem;
		height: 6px;
		background: #e5e7eb;
		border-radius: 3px;
		overflow: hidden;
	}

	.bar-fill {
		height: 100%;
		transition: width 0.3s;

		&.cpu {
			background: linear-gradient(90deg, #3b82f6, #2563eb);
		}

		&.memory {
			background: linear-gradient(90deg, #8b5cf6, #7c3aed);
		}
	}
</style>
