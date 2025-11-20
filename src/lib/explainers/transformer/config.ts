/**
 * Transformer Explainer Configuration
 * Implements the ExplainerConfig interface
 */

import type { ExplainerConfig } from '~/lib/shared/types/explainer';
import TransformerMain from './components/TransformerMain.svelte';
import InputForm from './components/InputForm.svelte';
import Topbar from './components/Topbar.svelte';
import Article from './components/article/Article.svelte';
import Textbook from './components/textbook/Textbook.svelte';
import {
	tokens,
	tokenIds,
	modelData,
	modelSession,
	inputText,
	temperature,
	sampling,
	selectedExampleIdx,
	highlightedToken,
	highlightedHead,
	expandedBlock,
	vectorHeight,
	headContentHeight,
	isModelRunning,
	isFetchingModel,
	isTextbookOpen,
	modelMetaMap
} from './store';
import { AutoTokenizer } from '@xenova/transformers';
import { runModel, fakeRunWithCachedData, adjustTemperature } from './utils/data';
import { ex0, ex1, ex2, ex3, ex4 } from './constants/examples';

export const transformerConfig: ExplainerConfig = {
	id: 'transformer',
	name: 'Transformer Explainer',
	description: 'Interactive visualization of GPT-2 transformer architecture',
	icon: '🤖',
	theme: {
		primary: '#3b82f6', // blue-500
		secondary: '#8b5cf6', // purple-500
		accent: '#ec4899' // pink-500
	},

	modelMeta: {
		models: modelMetaMap,
		defaultModel: 'gpt2'
	},

	components: {
		MainComponent: TransformerMain,
		InputComponent: InputForm,
		TopbarComponent: Topbar,
		ArticleComponent: Article,
		TextbookComponent: Textbook
	},

	dataProcessing: {
		initialize: async () => {
			// Initialize tokenizer
			const tokenizer = await AutoTokenizer.from_pretrained('Xenova/gpt2');
			return tokenizer;
		},

		preprocessInput: async (input: string) => {
			// Tokenize input text
			return input.trim();
		},

		runModel: async (input: string, options?: any) => {
			const { tokenizer, temperature: temp, sampling: samp } = options || {};

			return await runModel({
				tokenizer,
				input,
				temperature: temp,
				sampling: samp
			});
		},

		postprocessOutput: (output: any) => {
			// Post-process model output if needed
			return output;
		},

		loadExample: async (exampleId: string | number) => {
			const examples = [ex0, ex1, ex2, ex3, ex4];
			return examples[exampleId as number];
		}
	},

	stores: {
		modelData,
		input: inputText,
		ui: {
			expandedBlock,
			vectorHeight,
			headContentHeight,
			highlightedToken,
			highlightedHead,
			isTextbookOpen
		},
		model: {
			tokens,
			tokenIds,
			modelSession,
			temperature,
			sampling,
			selectedExampleIdx,
			isModelRunning,
			isFetchingModel
		},
		initialize: () => {
			// Initialize stores if needed
		},
		reset: () => {
			// Reset stores to initial state
			inputText.set('Data visualization empowers users to');
			temperature.set(0.8);
			sampling.set({ type: 'top-k', value: 5 });
			selectedExampleIdx.set(0);
			expandedBlock.set({ id: null });
		}
	},

	examples: [
		{
			id: 0,
			label: 'Data visualization',
			description: 'Data visualization empowers users to',
			input: 'Data visualization empowers users to',
			precomputedOutput: ex0
		},
		{
			id: 1,
			label: 'Artificial Intelligence',
			description: 'Artificial Intelligence is transforming the',
			input: 'Artificial Intelligence is transforming the',
			precomputedOutput: ex1
		},
		{
			id: 2,
			label: 'Spaceship approaching',
			description: 'As the spaceship was approaching the',
			input: 'As the spaceship was approaching the',
			precomputedOutput: ex2
		},
		{
			id: 3,
			label: 'Deserted planet',
			description: 'On the deserted planet they discovered a',
			input: 'On the deserted planet they discovered a',
			precomputedOutput: ex3
		},
		{
			id: 4,
			label: 'IEEE VIS conference',
			description: 'IEEE VIS conference highlights the',
			input: 'IEEE VIS conference highlights the',
			precomputedOutput: ex4
		}
	]
};
