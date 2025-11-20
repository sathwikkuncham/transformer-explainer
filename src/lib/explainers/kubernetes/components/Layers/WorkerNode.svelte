<script lang="ts">
	/**
	 * Worker Node Component
	 * Represents a Kubernetes worker node containing pods with .NET applications
	 */
	import { createEventDispatcher } from 'svelte';
	import { hoveredComponent, metrics } from '../../store';
	import { slide } from 'svelte/transition';

	export let expanded = false;

	const dispatch = createEventDispatcher();

	function handleClick() {
		dispatch('click');
	}

	function handleExpand() {
		dispatch('expand');
	}
</script>

<div
	class="worker-node"
	class:expanded
	class:hovered={$hoveredComponent === 'worker'}
	on:mouseenter={() => hoveredComponent.set('worker')}
	on:mouseleave={() => hoveredComponent.set(null)}
>
	<!-- Worker Node Header -->
	<div class="node-header" on:click={handleExpand} role="button" tabindex="0" on:keypress={(e) => e.key === 'Enter' && handleExpand()}>
		<div class="flex items-center gap-2">
			<span class="text-xl">🖥️</span>
			<div>
				<h3 class="font-semibold text-gray-700">Worker Node</h3>
				<p class="text-xs text-gray-500">Kubelet • Container Runtime</p>
			</div>
		</div>
		<button class="expand-btn" on:click|stopPropagation={handleExpand}>
			{expanded ? '−' : '+'}
		</button>
	</div>

	{#if expanded}
		<div class="node-content" transition:slide={{ duration: 300 }}>
			<!-- Pod Container -->
			<div class="pod" on:click|stopPropagation={handleClick} role="button" tabindex="0" on:keypress={(e) => e.key === 'Enter' && handleClick()}>
				<div class="pod-header">
					<span class="text-lg">📦</span>
					<div>
						<h4 class="font-semibold text-sm text-gray-700">Pod</h4>
						<p class="text-xs text-gray-500">.NET Application Pod</p>
					</div>
					<div class="pod-status">
						<span class="status-indicator running"></span>
						<span class="text-xs text-green-600">Running</span>
					</div>
				</div>

				<!-- .NET Application Container -->
				<div class="container dotnet-container">
					<div class="container-header">
						<span class="text-base">🐳</span>
						<span class="text-sm font-medium text-gray-700"
							>.NET Application Container</span
						>
					</div>

					<div class="app-stack">
						<!-- Kestrel Web Server -->
						<div class="stack-layer kestrel">
							<div class="layer-icon">🌐</div>
							<div class="layer-info">
								<div class="layer-name">Kestrel Web Server</div>
								<div class="layer-desc">Async I/O</div>
							</div>
						</div>

						<!-- ASP.NET Core Pipeline -->
						<div class="stack-layer aspnet">
							<div class="layer-icon">⚙️</div>
							<div class="layer-info">
								<div class="layer-name">ASP.NET Core Pipeline</div>
								<div class="layer-desc">Middleware Chain</div>
							</div>
						</div>

						<!-- Application Logic -->
						<div class="stack-layer app-logic">
							<div class="layer-icon">📝</div>
							<div class="layer-info">
								<div class="layer-name">Application Logic</div>
								<div class="layer-desc">Controllers / Handlers</div>
							</div>
						</div>

						<!-- EF Core DbContext -->
						<div class="stack-layer ef-core">
							<div class="layer-icon">🗄️</div>
							<div class="layer-info">
								<div class="layer-name">EF Core DbContext</div>
								<div class="layer-desc">ORM • Change Tracking</div>
							</div>
						</div>
					</div>
				</div>

				<!-- Pod Metrics -->
				<div class="pod-metrics">
					<div class="metric">
						<span class="metric-label">CPU</span>
						<div class="metric-bar">
							<div class="metric-fill" style="width: {$metrics.pod.cpu}%"></div>
						</div>
						<span class="metric-value">{$metrics.pod.cpu}%</span>
					</div>
					<div class="metric">
						<span class="metric-label">Memory</span>
						<div class="metric-bar">
							<div class="metric-fill memory" style="width: {$metrics.pod.memory}%"
							></div>
						</div>
						<span class="metric-value">{$metrics.pod.memory}%</span>
					</div>
				</div>

				<!-- Pod Endpoints -->
				<div class="pod-endpoints">
					<div class="endpoint">
						<span class="endpoint-label">.NET Pod</span>
						<span class="endpoint-value">→ Endpoints</span>
					</div>
				</div>
			</div>

			<!-- Health Checks -->
			<div class="health-checks">
				<div class="health-check">
					<span class="text-xs">Liveness:</span>
					<span class="status-indicator running"></span>
				</div>
				<div class="health-check">
					<span class="text-xs">Readiness:</span>
					<span class="status-indicator running"></span>
				</div>
			</div>
		</div>
	{/if}
</div>

<style lang="scss">
	.worker-node {
		background: white;
		border: 2px solid #94a3b8;
		border-radius: 12px;
		padding: 1rem;
		transition: all 0.3s;
		min-width: 600px;
		max-width: 800px;

		&:hover,
		&.hovered {
			border-color: #3b82f6;
			box-shadow: 0 8px 16px rgba(59, 130, 246, 0.15);
		}

		&.expanded {
			border-color: #3b82f6;
		}
	}

	.node-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		cursor: pointer;
		user-select: none;
	}

	.expand-btn {
		width: 28px;
		height: 28px;
		border-radius: 50%;
		border: 2px solid #e5e7eb;
		background: white;
		color: #6b7280;
		font-size: 1.2rem;
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		transition: all 0.2s;

		&:hover {
			border-color: #3b82f6;
			color: #3b82f6;
			background: #eff6ff;
		}
	}

	.node-content {
		margin-top: 1rem;
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.pod {
		background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
		border: 2px dashed #3b82f6;
		border-radius: 10px;
		padding: 1rem;
		cursor: pointer;
		transition: all 0.3s;

		&:hover {
			box-shadow: 0 4px 12px rgba(59, 130, 246, 0.2);
		}
	}

	.pod-header {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		margin-bottom: 1rem;
	}

	.pod-status {
		margin-left: auto;
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.status-indicator {
		width: 8px;
		height: 8px;
		border-radius: 50%;
		background: #10b981;
		animation: pulse 2s ease-in-out infinite;

		&.running {
			background: #10b981;
		}
	}

	.container {
		background: white;
		border: 1px solid #cbd5e1;
		border-radius: 8px;
		padding: 0.75rem;
		margin-bottom: 0.75rem;
	}

	.container-header {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		margin-bottom: 0.75rem;
		padding-bottom: 0.5rem;
		border-bottom: 1px solid #e5e7eb;
	}

	.app-stack {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.stack-layer {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		padding: 0.5rem;
		background: #f9fafb;
		border: 1px solid #e5e7eb;
		border-radius: 6px;
		transition: all 0.2s;

		&:hover {
			background: #f3f4f6;
			border-color: #3b82f6;
		}

		&.kestrel {
			border-left: 3px solid #06b6d4;
		}

		&.aspnet {
			border-left: 3px solid #8b5cf6;
		}

		&.app-logic {
			border-left: 3px solid #ec4899;
		}

		&.ef-core {
			border-left: 3px solid #f59e0b;
		}
	}

	.layer-icon {
		font-size: 1.25rem;
	}

	.layer-info {
		flex: 1;
	}

	.layer-name {
		font-size: 0.875rem;
		font-weight: 600;
		color: #374151;
	}

	.layer-desc {
		font-size: 0.75rem;
		color: #6b7280;
	}

	.pod-metrics {
		display: flex;
		gap: 1rem;
		margin-top: 0.75rem;
		padding-top: 0.75rem;
		border-top: 1px solid #cbd5e1;
	}

	.metric {
		flex: 1;
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.metric-label {
		font-size: 0.75rem;
		font-weight: 500;
		color: #6b7280;
		min-width: 50px;
	}

	.metric-bar {
		flex: 1;
		height: 8px;
		background: #e5e7eb;
		border-radius: 4px;
		overflow: hidden;
	}

	.metric-fill {
		height: 100%;
		background: linear-gradient(90deg, #3b82f6, #2563eb);
		transition: width 0.3s;

		&.memory {
			background: linear-gradient(90deg, #8b5cf6, #7c3aed);
		}
	}

	.metric-value {
		font-size: 0.75rem;
		font-weight: 600;
		color: #374151;
		min-width: 35px;
		text-align: right;
	}

	.pod-endpoints {
		margin-top: 0.5rem;
		padding: 0.5rem;
		background: #f0f9ff;
		border-radius: 6px;
		text-align: center;
	}

	.endpoint {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
		font-size: 0.75rem;
	}

	.endpoint-label {
		color: #6b7280;
	}

	.endpoint-value {
		color: #3b82f6;
		font-weight: 600;
	}

	.health-checks {
		display: flex;
		gap: 1rem;
		padding: 0.5rem;
		background: #f9fafb;
		border-radius: 6px;
		justify-content: center;
	}

	.health-check {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		font-size: 0.75rem;
		color: #6b7280;
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
</style>
