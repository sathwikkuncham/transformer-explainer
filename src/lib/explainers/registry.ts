/**
 * Explainer Registry
 * Central registry for all available explainers
 *
 * To add a new explainer:
 * 1. Create a folder in lib/explainers/{explainer-name}/
 * 2. Implement the ExplainerConfig interface in config.ts
 * 3. Import and register it here
 *
 * See lib/explainers/transformer/ for a complete example
 */

import type { ExplainerRegistry } from '~/lib/shared/types/explainer';
import { transformerConfig } from './transformer/config';

/**
 * Registry of all available explainers
 * Each explainer is identified by a unique key
 */
export const explainerRegistry: ExplainerRegistry = {
	transformer: transformerConfig
	// Future explainers will be added here:
	// cnn: cnnConfig,
	// gan: ganConfig,
	// diffusion: diffusionConfig
};

/**
 * Get explainer configuration by ID
 */
export function getExplainer(explainerId: string) {
	const config = explainerRegistry[explainerId];
	if (!config) {
		throw new Error(`Explainer "${explainerId}" not found in registry`);
	}
	return config;
}

/**
 * Get all available explainer IDs
 */
export function getAvailableExplainers() {
	return Object.keys(explainerRegistry);
}

/**
 * Check if an explainer exists
 */
export function hasExplainer(explainerId: string) {
	return explainerId in explainerRegistry;
}

/**
 * Get default explainer (first in registry)
 */
export function getDefaultExplainer() {
	const ids = getAvailableExplainers();
	return ids.length > 0 ? explainerRegistry[ids[0]] : null;
}
