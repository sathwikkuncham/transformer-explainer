<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { hoveredComponent } from '../../store';

	const dispatch = createEventDispatcher();
</script>

<div
	class="observability"
	data-component-id="observability"
	class:hovered={$hoveredComponent === 'observability'}
	on:click={() => dispatch('click')}
	on:mouseenter={() => hoveredComponent.set('observability')}
	on:mouseleave={() => hoveredComponent.set(null)}
	role="button"
	tabindex="0"
	on:keypress={(e) => e.key === 'Enter' && dispatch('click')}
>
	<div class="obs-header">
		<div class="icon">📊</div>
		<div>
			<h4 class="font-semibold text-sm text-gray-700">Observability Stack</h4>
			<p class="text-xs text-gray-500">Prometheus • Azure Monitor</p>
		</div>
	</div>

	<div class="obs-features">
		<div class="feature">
			<span class="feature-icon">📈</span>
			<span class="feature-label">Metrics</span>
		</div>
		<div class="feature">
			<span class="feature-icon">🔍</span>
			<span class="feature-label">Traces</span>
		</div>
		<div class="feature">
			<span class="feature-icon">📝</span>
			<span class="feature-label">Logs</span>
		</div>
	</div>

	<div class="otel-badge">
		<span class="text-xs font-semibold">OpenTelemetry</span>
	</div>
</div>

<style lang="scss">
	.observability {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		padding: 1rem;
		background: linear-gradient(135deg, #f5f3ff 0%, #ede9fe 100%);
		border: 2px solid #8b5cf6;
		border-radius: 10px;
		cursor: pointer;
		transition: all 0.3s;
		min-width: 280px;

		&:hover,
		&.hovered {
			box-shadow: 0 4px 12px rgba(139, 92, 246, 0.3);
			transform: scale(1.05);
		}
	}

	.obs-header {
		display: flex;
		align-items: center;
		gap: 0.75rem;
	}

	.icon {
		font-size: 1.75rem;
	}

	.obs-features {
		display: flex;
		gap: 0.5rem;
		justify-content: space-around;
	}

	.feature {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.25rem;
		padding: 0.5rem;
		background: rgba(255, 255, 255, 0.5);
		border-radius: 6px;
		flex: 1;
	}

	.feature-icon {
		font-size: 1.25rem;
	}

	.feature-label {
		font-size: 0.7rem;
		color: #5b21b6;
		font-weight: 500;
	}

	.otel-badge {
		text-align: center;
		padding: 0.4rem;
		background: white;
		border-radius: 6px;
		color: #7c3aed;
		border: 1px solid #a78bfa;
	}
</style>
