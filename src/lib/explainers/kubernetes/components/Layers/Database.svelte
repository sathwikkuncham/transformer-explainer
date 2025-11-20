<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { hoveredComponent, metrics } from '../../store';

	const dispatch = createEventDispatcher();
</script>

<div
	class="database"
	class:hovered={$hoveredComponent === 'database'}
	on:click={() => dispatch('click')}
	on:mouseenter={() => hoveredComponent.set('database')}
	on:mouseleave={() => hoveredComponent.set(null)}
	role="button"
	tabindex="0"
	on:keypress={(e) => e.key === 'Enter' && dispatch('click')}
>
	<div class="db-header">
		<div class="icon">🗄️</div>
		<div>
			<h4 class="font-semibold text-sm text-gray-700">SQL Database</h4>
			<p class="text-xs text-gray-500">Azure SQL / PostgreSQL</p>
		</div>
	</div>

	<div class="db-content">
		<div class="outbox-table">
			<div class="table-icon">📮</div>
			<div>
				<div class="text-xs font-semibold text-gray-700">Transactional Outbox Table</div>
				<div class="text-xs text-gray-500">
					{$metrics.database.outboxMessages} pending messages
				</div>
			</div>
		</div>

		<div class="db-stats">
			<div class="stat">
				<span class="stat-value">{$metrics.database.connections}</span>
				<span class="stat-label">Connections</span>
			</div>
			<div class="stat">
				<span class="stat-value">{$metrics.database.transactions}</span>
				<span class="stat-label">Transactions</span>
			</div>
		</div>
	</div>
</div>

<style lang="scss">
	.database {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		padding: 1rem;
		background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
		border: 2px solid #f59e0b;
		border-radius: 10px;
		cursor: pointer;
		transition: all 0.3s;
		min-width: 250px;

		&:hover,
		&.hovered {
			box-shadow: 0 4px 12px rgba(245, 158, 11, 0.3);
			transform: scale(1.05);
		}
	}

	.db-header {
		display: flex;
		align-items: center;
		gap: 0.75rem;
	}

	.icon {
		font-size: 1.75rem;
	}

	.db-content {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.outbox-table {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.5rem;
		background: rgba(255, 255, 255, 0.5);
		border-radius: 6px;
		border: 1px solid rgba(245, 158, 11, 0.3);
	}

	.table-icon {
		font-size: 1.25rem;
	}

	.db-stats {
		display: flex;
		gap: 1rem;
		justify-content: space-around;
	}

	.stat {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.25rem;
	}

	.stat-value {
		font-size: 1.25rem;
		font-weight: 700;
		color: #92400e;
	}

	.stat-label {
		font-size: 0.65rem;
		color: #78350f;
		text-transform: uppercase;
	}
</style>
