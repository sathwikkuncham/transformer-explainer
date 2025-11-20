/**
 * Kubernetes .NET Architecture Explainer Configuration
 * Implements the ExplainerConfig interface
 */

import type { ExplainerConfig } from '~/lib/shared/types/explainer';
import KubernetesMain from './components/KubernetesMain.svelte';
import {
	activeRequest,
	selectedComponent,
	expandedLayer,
	isAnimating,
	selectedExampleIdx,
	exampleRequests,
	metrics,
	deploymentConfig,
	resetStores
} from './store';

export const kubernetesConfig: ExplainerConfig = {
	id: 'kubernetes',
	name: '.NET on Kubernetes',
	description: 'Interactive visualization of .NET microservices on Kubernetes',
	icon: '☸️',

	theme: {
		primary: '#326CE5', // Kubernetes blue
		secondary: '#512BD4', // .NET purple
		accent: '#0078D4' // Azure blue
	},

	modelMeta: {
		models: {
			'dotnet-microservice': {
				layer_num: 4, // Kestrel, ASP.NET, App Logic, EF Core
				replicas: 3,
				namespace: 'production'
			}
		},
		defaultModel: 'dotnet-microservice'
	},

	components: {
		MainComponent: KubernetesMain
	},

	dataProcessing: {
		initialize: async () => {
			// Initialize Kubernetes explainer
			console.log('Initializing Kubernetes .NET Architecture Explainer');
		},

		preprocessInput: async (input: any) => {
			// No preprocessing needed for this explainer
			return input;
		},

		runModel: async (input: any, options?: any) => {
			// Simulate request flow through the system
			return {
				status: 'success',
				requestId: `req-${Date.now()}`,
				path: input.path || []
			};
		},

		postprocessOutput: (output: any) => {
			return output;
		},

		loadExample: async (exampleId: string | number) => {
			const example = exampleRequests[exampleId as number];
			return example;
		}
	},

	stores: {
		modelData: activeRequest,
		input: selectedComponent,
		ui: {
			expandedLayer,
			selectedComponent,
			isAnimating
		},
		model: {
			activeRequest,
			metrics,
			deploymentConfig,
			selectedExampleIdx
		},
		initialize: () => {
			console.log('Initializing Kubernetes stores');
		},
		reset: () => {
			resetStores();
		}
	},

	examples: exampleRequests.map((req, idx) => ({
		id: idx,
		label: req.label,
		description: req.description,
		input: req.path,
		precomputedOutput: null
	}))
};
