<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { hoveredComponent } from '../../store';

	const dispatch = createEventDispatcher();
</script>

<div
	class="saga-orchestration"
	data-component-id="saga-orchestrator"
	class:hovered={$hoveredComponent === 'saga'}
	on:click={() => dispatch('click')}
	on:mouseenter={() => hoveredComponent.set('saga')}
	on:mouseleave={() => hoveredComponent.set(null)}
	role="button"
	tabindex="0"
	on:keypress={(e) => e.key === 'Enter' && dispatch('click')}
>
	<div class="icon">🎭</div>
	<div>
		<h4 class="font-semibold text-sm text-gray-700">Saga Orchestration</h4>
		<p class="text-xs text-gray-500">Manage Deployments</p>
	</div>
</div>

<style lang="scss">
	.saga-orchestration {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.5rem;
		padding: 1rem;
		background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
		border: 2px solid #22c55e;
		border-radius: 10px;
		cursor: pointer;
		transition: all 0.3s;
		min-width: 160px;
		text-align: center;

		&:hover,
		&.hovered {
			box-shadow: 0 4px 12px rgba(34, 197, 94, 0.3);
			transform: scale(1.05);
		}
	}

	.icon {
		font-size: 1.75rem;
	}
</style>
