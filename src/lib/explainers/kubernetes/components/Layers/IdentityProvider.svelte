<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { hoveredComponent } from '../../store';

	const dispatch = createEventDispatcher();
</script>

<div
	class="identity-provider"
	data-component-id="identity-provider"
	class:hovered={$hoveredComponent === 'identity'}
	on:click={() => dispatch('click')}
	on:mouseenter={() => hoveredComponent.set('identity')}
	on:mouseleave={() => hoveredComponent.set(null)}
	role="button"
	tabindex="0"
	on:keypress={(e) => e.key === 'Enter' && dispatch('click')}
>
	<div class="icon">🔐</div>
	<div>
		<h4 class="font-semibold text-sm text-gray-700">Identity Provider</h4>
		<p class="text-xs text-gray-500">Duende IdentityServer</p>
	</div>
</div>

<style lang="scss">
	.identity-provider {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.5rem;
		padding: 1rem;
		background: linear-gradient(135deg, #fdf4ff 0%, #fae8ff 100%);
		border: 2px solid #a855f7;
		border-radius: 10px;
		cursor: pointer;
		transition: all 0.3s;
		min-width: 160px;
		text-align: center;

		&:hover,
		&.hovered {
			box-shadow: 0 4px 12px rgba(168, 85, 247, 0.3);
			transform: scale(1.05);
		}
	}

	.icon {
		font-size: 1.75rem;
	}
</style>
