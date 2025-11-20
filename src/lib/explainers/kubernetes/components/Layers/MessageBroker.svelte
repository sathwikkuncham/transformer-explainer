<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { hoveredComponent, metrics } from '../../store';

	const dispatch = createEventDispatcher();
</script>

<div
	class="message-broker"
	class:hovered={$hoveredComponent === 'message-broker'}
	on:click={() => dispatch('click')}
	on:mouseenter={() => hoveredComponent.set('message-broker')}
	on:mouseleave={() => hoveredComponent.set(null)}
	role="button"
	tabindex="0"
	on:keypress={(e) => e.key === 'Enter' && dispatch('click')}
>
	<div class="broker-header">
		<div class="icon">📨</div>
		<div>
			<h4 class="font-semibold text-sm text-gray-700">Message Broker</h4>
			<p class="text-xs text-gray-500">RabbitMQ / Azure Service Bus</p>
		</div>
	</div>

	<div class="broker-content">
		<div class="queue-stats">
			<div class="queue-stat">
				<span class="label">Published</span>
				<span class="value">{$metrics.messageBroker.published}</span>
			</div>
			<div class="queue-stat">
				<span class="label">Consumed</span>
				<span class="value">{$metrics.messageBroker.consumed}</span>
			</div>
			<div class="queue-stat pending">
				<span class="label">Pending</span>
				<span class="value">{$metrics.messageBroker.pending}</span>
			</div>
		</div>
	</div>
</div>

<style lang="scss">
	.message-broker {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		padding: 1rem;
		background: linear-gradient(135deg, #fce7f3 0%, #fbcfe8 100%);
		border: 2px solid #ec4899;
		border-radius: 10px;
		cursor: pointer;
		transition: all 0.3s;
		min-width: 250px;

		&:hover,
		&.hovered {
			box-shadow: 0 4px 12px rgba(236, 72, 153, 0.3);
			transform: scale(1.05);
		}
	}

	.broker-header {
		display: flex;
		align-items: center;
		gap: 0.75rem;
	}

	.icon {
		font-size: 1.75rem;
	}

	.broker-content {
		padding: 0.5rem;
		background: rgba(255, 255, 255, 0.5);
		border-radius: 6px;
	}

	.queue-stats {
		display: flex;
		justify-content: space-around;
		gap: 0.5rem;
	}

	.queue-stat {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.25rem;

		&.pending .value {
			color: #dc2626;
			font-weight: 700;
		}
	}

	.label {
		font-size: 0.65rem;
		color: #831843;
		text-transform: uppercase;
	}

	.value {
		font-size: 1.1rem;
		font-weight: 600;
		color: #9f1239;
	}
</style>
