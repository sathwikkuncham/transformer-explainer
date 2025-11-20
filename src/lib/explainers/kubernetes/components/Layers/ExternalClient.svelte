<script lang="ts">
	/**
	 * External Client Component
	 * Represents web/mobile clients making requests to the system
	 */
	import { createEventDispatcher } from 'svelte';
	import { hoveredComponent } from '../../store';

	const dispatch = createEventDispatcher();

	function handleClick() {
		dispatch('click');
	}
</script>

<div
	class="external-client"
	data-component-id="external-client"
	class:hovered={$hoveredComponent === 'external'}
	on:click={handleClick}
	on:mouseenter={() => hoveredComponent.set('external')}
	on:mouseleave={() => hoveredComponent.set(null)}
	role="button"
	tabindex="0"
	on:keypress={(e) => e.key === 'Enter' && handleClick()}
>
	<div class="client-icon">
		<div class="device web">
			<span class="text-2xl">💻</span>
			<span class="label">Web</span>
		</div>
		<div class="device mobile">
			<span class="text-2xl">📱</span>
			<span class="label">Mobile</span>
		</div>
	</div>
	<div class="client-label">
		<h3 class="font-semibold text-gray-700">External Clients</h3>
		<p class="text-xs text-gray-500">HTTPS Requests</p>
	</div>
</div>

<style lang="scss">
	.external-client {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1rem;
		padding: 1.5rem;
		background: white;
		border: 2px solid #e5e7eb;
		border-radius: 12px;
		cursor: pointer;
		transition: all 0.3s;
		min-width: 200px;

		&:hover,
		&.hovered {
			border-color: #3b82f6;
			box-shadow: 0 4px 12px rgba(59, 130, 246, 0.2);
			transform: translateY(-2px);
		}
	}

	.client-icon {
		display: flex;
		gap: 2rem;
		align-items: center;
	}

	.device {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.5rem;

		.label {
			font-size: 0.75rem;
			color: #6b7280;
			font-weight: 500;
		}
	}

	.client-label {
		text-align: center;
	}
</style>
