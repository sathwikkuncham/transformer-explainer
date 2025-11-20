<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { hoveredComponent } from '../../store';

	const dispatch = createEventDispatcher();
</script>

<div
	class="consumer-services"
	class:hovered={$hoveredComponent === 'consumer'}
	on:click={() => dispatch('click')}
	on:mouseenter={() => hoveredComponent.set('consumer')}
	on:mouseleave={() => hoveredComponent.set(null)}
	role="button"
	tabindex="0"
	on:keypress={(e) => e.key === 'Enter' && dispatch('click')}
>
	<div class="icon">🎧</div>
	<div>
		<h4 class="font-semibold text-sm text-gray-700">Consumer Service Pods</h4>
		<p class="text-xs text-gray-500">Async Message Handlers</p>
	</div>
	<div class="pods-indicator">
		<span class="pod-dot"></span>
		<span class="pod-dot"></span>
		<span class="pod-dot"></span>
	</div>
</div>

<style lang="scss">
	.consumer-services {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.5rem;
		padding: 1rem;
		background: linear-gradient(135deg, #f0fdfa 0%, #ccfbf1 100%);
		border: 2px solid #14b8a6;
		border-radius: 10px;
		cursor: pointer;
		transition: all 0.3s;
		min-width: 220px;
		text-align: center;

		&:hover,
		&.hovered {
			box-shadow: 0 4px 12px rgba(20, 184, 166, 0.3);
			transform: scale(1.05);
		}
	}

	.icon {
		font-size: 1.75rem;
	}

	.pods-indicator {
		display: flex;
		gap: 0.5rem;
		margin-top: 0.25rem;
	}

	.pod-dot {
		width: 10px;
		height: 10px;
		border-radius: 50%;
		background: #14b8a6;
		animation: pulse 2s ease-in-out infinite;

		&:nth-child(2) {
			animation-delay: 0.2s;
		}

		&:nth-child(3) {
			animation-delay: 0.4s;
		}
	}

	@keyframes pulse {
		0%,
		100% {
			opacity: 1;
		}
		50% {
			opacity: 0.3;
		}
	}
</style>
