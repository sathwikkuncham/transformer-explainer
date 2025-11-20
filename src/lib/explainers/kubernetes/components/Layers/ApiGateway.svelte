<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { hoveredComponent } from '../../store';

	const dispatch = createEventDispatcher();
</script>

<div
	class="api-gateway"
	data-component-id="api-gateway"
	class:hovered={$hoveredComponent === 'api-gateway'}
	on:click={() => dispatch('click')}
	on:mouseenter={() => hoveredComponent.set('api-gateway')}
	on:mouseleave={() => hoveredComponent.set(null)}
	role="button"
	tabindex="0"
	on:keypress={(e) => e.key === 'Enter' && dispatch('click')}
>
	<div class="icon">🚪</div>
	<div>
		<h4 class="font-semibold text-sm text-gray-700">API Gateway / BFF</h4>
		<p class="text-xs text-gray-500">YARP .NET</p>
	</div>
</div>

<style lang="scss">
	.api-gateway {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.5rem;
		padding: 1rem;
		background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
		border: 2px solid #3b82f6;
		border-radius: 10px;
		cursor: pointer;
		transition: all 0.3s;
		min-width: 160px;
		text-align: center;

		&:hover,
		&.hovered {
			box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
			transform: scale(1.05);
		}
	}

	.icon {
		font-size: 1.75rem;
	}
</style>
