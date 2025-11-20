<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { hoveredComponent } from '../../store';

	const dispatch = createEventDispatcher();
</script>

<div
	class="ingress-controller"
	class:hovered={$hoveredComponent === 'ingress'}
	on:click={() => dispatch('click')}
	on:mouseenter={() => hoveredComponent.set('ingress')}
	on:mouseleave={() => hoveredComponent.set(null)}
	role="button"
	tabindex="0"
	on:keypress={(e) => e.key === 'Enter' && dispatch('click')}
>
	<div class="icon">🔀</div>
	<div>
		<h3 class="font-semibold text-gray-700">Ingress Controller</h3>
		<p class="text-xs text-gray-500">NGINX / Traefik</p>
	</div>
</div>

<style lang="scss">
	.ingress-controller {
		display: flex;
		align-items: center;
		gap: 1rem;
		padding: 1.25rem 2rem;
		background: linear-gradient(135deg, #fff7ed 0%, #fed7aa 100%);
		border: 2px solid #f97316;
		border-radius: 12px;
		cursor: pointer;
		transition: all 0.3s;
		min-width: 300px;

		&:hover,
		&.hovered {
			box-shadow: 0 6px 16px rgba(249, 115, 22, 0.3);
			transform: translateY(-3px);
		}
	}

	.icon {
		font-size: 2rem;
	}
</style>
