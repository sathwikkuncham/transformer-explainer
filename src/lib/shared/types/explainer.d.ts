/**
 * Core type definitions for the multi-explainer architecture
 * This file defines the interface that all explainers must implement
 */

import type { ComponentType } from 'svelte';
import type { Writable } from 'svelte/store';

/**
 * Base explainer configuration interface
 * Each explainer (transformer, CNN, GAN, diffusion) must implement this
 */
export interface ExplainerConfig {
	/** Unique identifier for the explainer */
	id: string;

	/** Display name */
	name: string;

	/** Short description */
	description: string;

	/** Icon or emoji for the explainer */
	icon?: string;

	/** Color theme for the explainer */
	theme?: {
		primary: string;
		secondary: string;
		accent: string;
	};

	/** Model metadata specific to this explainer */
	modelMeta: ExplainerModelMeta;

	/** Component registry for this explainer */
	components: ExplainerComponents;

	/** Data processing pipeline */
	dataProcessing: ExplainerDataProcessing;

	/** Store management */
	stores: ExplainerStores;

	/** Example data for the explainer */
	examples: ExplainerExample[];
}

/**
 * Model metadata - explainer-specific model configuration
 */
export interface ExplainerModelMeta {
	/** Available models for this explainer */
	models: Record<string, ModelMetaData>;

	/** Default model to use */
	defaultModel: string;
}

/**
 * Component registry - maps component slots to Svelte components
 */
export interface ExplainerComponents {
	/** Main visualization component */
	MainComponent: ComponentType;

	/** Input/control component */
	InputComponent?: ComponentType;

	/** Top bar component (or use shared) */
	TopbarComponent?: ComponentType;

	/** Article/documentation component */
	ArticleComponent?: ComponentType;

	/** Textbook component (guided tour) */
	TextbookComponent?: ComponentType;

	/** Additional visualization components */
	visualComponents?: ComponentType[];
}

/**
 * Data processing pipeline interface
 * Defines how input is processed and how model runs
 */
export interface ExplainerDataProcessing {
	/** Initialize the model/tokenizer */
	initialize: () => Promise<void>;

	/** Process user input before model execution */
	preprocessInput?: (input: any) => Promise<any>;

	/** Run the model with given input */
	runModel: (input: any, options?: any) => Promise<any>;

	/** Post-process model output */
	postprocessOutput?: (output: any) => any;

	/** Load pre-computed example data */
	loadExample?: (exampleId: string | number) => Promise<any>;
}

/**
 * Store management interface
 * Each explainer manages its own stores
 */
export interface ExplainerStores {
	/** Model data store */
	modelData: Writable<any>;

	/** Input/tokens store */
	input: Writable<any>;

	/** UI state stores */
	ui: Record<string, Writable<any>>;

	/** Model state stores */
	model: Record<string, Writable<any>>;

	/** Initialize all stores */
	initialize: () => void;

	/** Reset stores to initial state */
	reset: () => void;
}

/**
 * Example data structure
 */
export interface ExplainerExample {
	id: string | number;
	label: string;
	description?: string;
	input: any;
	precomputedOutput?: any;
}

/**
 * Explainer registry type
 * Maps explainer IDs to their configurations
 */
export type ExplainerRegistry = Record<string, ExplainerConfig>;

/**
 * Model metadata (from original global.d.ts)
 */
export interface ModelMetaData {
	layer_num?: number;
	attention_head_num?: number;
	dimension?: number;
	chunkTotal?: number;
	[key: string]: any;
}
