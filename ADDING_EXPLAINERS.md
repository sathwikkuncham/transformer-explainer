# Quick Start: Adding a New Explainer

This guide walks you through adding a new explainer to the codebase in **30 minutes**.

## Prerequisites

- Familiarity with Svelte and TypeScript
- Understanding of the AI model you're explaining (CNN, GAN, Diffusion, etc.)
- Knowledge of D3.js or Canvas for visualizations (optional but helpful)

---

## Step-by-Step Guide

### 1. Create Folder Structure (2 min)

```bash
cd src/lib/explainers
mkdir -p my-explainer/{components/Popovers,utils,constants,store,types}
```

Replace `my-explainer` with your explainer name (e.g., `cnn`, `gan`, `diffusion`).

---

### 2. Copy Template Files (3 min)

Use the transformer explainer as a template:

```bash
# Copy store structure
cp transformer/store/index.ts my-explainer/store/

# Copy utility structure
cp transformer/utils/data.ts my-explainer/utils/
cp transformer/utils/animation.ts my-explainer/utils/

# Copy config template
cp transformer/config.ts my-explainer/config.ts
```

---

### 3. Create Main Component (10 min)

Create `src/lib/explainers/my-explainer/components/MyExplainerMain.svelte`:

```svelte
<script lang="ts">
	import { onMount } from 'svelte';

	// Import shared components
	import Matrix from '~/lib/shared/components/Matrix.svelte';
	import VectorCanvas from '~/lib/shared/components/VectorCanvas.svelte';
	import Slider from '~/lib/shared/components/Slider.svelte';
	import CommonPopover from '~/lib/shared/components/CommonPopover.svelte';

	// Import your stores
	import { modelData, input, selectedLayer } from '../store';

	// Import your specific components
	import LayerVisualization from './LayerVisualization.svelte';
	import InputPanel from './InputPanel.svelte';

	let active = false;

	onMount(async () => {
		// Initialize your explainer
		active = true;

		// Load model, set up event handlers, etc.
		await initializeModel();
	});

	async function initializeModel() {
		// Your initialization logic
	}
</script>

<div class="explainer-container" class:active>
	<div class="input-section">
		<InputPanel />
	</div>

	<div class="visualization-section">
		<LayerVisualization />

		<!-- Use shared components -->
		<Matrix
			data={$modelData.weights}
			cellHeight={20}
			cellWidth={20}
			colorScale="viridis"
		/>
	</div>

	<div class="controls-section">
		<Slider bind:value={$selectedLayer} min={0} max={5} label="Layer" />
	</div>
</div>

<style lang="scss">
	.explainer-container {
		height: 100%;
		width: 100%;
		display: grid;
		grid-template-columns: 1fr 3fr 1fr;
		gap: 2rem;
		padding: 2rem;
		opacity: 0;
		transition: opacity 0.5s;

		&.active {
			opacity: 1;
		}
	}

	.visualization-section {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}
</style>
```

---

### 4. Define Configuration (5 min)

Update `src/lib/explainers/my-explainer/config.ts`:

```typescript
import type { ExplainerConfig } from '~/lib/shared/types/explainer';
import MyExplainerMain from './components/MyExplainerMain.svelte';
import { modelData, input, selectedLayer } from './store';
import { runModel } from './utils/data';

export const myExplainerConfig: ExplainerConfig = {
	id: 'my-explainer',
	name: 'My Explainer',
	description: 'Interactive visualization of [Your Model]',
	icon: '🎯', // Choose an appropriate emoji

	theme: {
		primary: '#3b82f6',
		secondary: '#8b5cf6',
		accent: '#ec4899'
	},

	modelMeta: {
		models: {
			'model-v1': { layer_num: 5 },
			'model-v2': { layer_num: 8 }
		},
		defaultModel: 'model-v1'
	},

	components: {
		MainComponent: MyExplainerMain
	},

	dataProcessing: {
		initialize: async () => {
			// Initialize tokenizer/preprocessor
		},

		runModel: async (input, options) => {
			return await runModel(input, options);
		},

		loadExample: async (exampleId) => {
			// Load precomputed example
		}
	},

	stores: {
		modelData,
		input,
		ui: { selectedLayer },
		model: {},
		initialize: () => {},
		reset: () => {
			input.set(null);
			selectedLayer.set(0);
		}
	},

	examples: [
		{ id: 0, label: 'Example 1', input: '...' },
		{ id: 1, label: 'Example 2', input: '...' }
	]
};
```

---

### 5. Create Stores (3 min)

Update `src/lib/explainers/my-explainer/store/index.ts`:

```typescript
import { writable, derived } from 'svelte/store';

// Model data
export const modelData = writable(null);
export const input = writable(null);

// UI state
export const selectedLayer = writable(0);
export const isModelRunning = writable(false);

// Derived stores
export const currentLayerData = derived(
	[modelData, selectedLayer],
	([$modelData, $selectedLayer]) => {
		return $modelData?.layers[$selectedLayer];
	}
);
```

---

### 6. Register Explainer (1 min)

Add to `src/lib/explainers/registry.ts`:

```typescript
import { myExplainerConfig } from './my-explainer/config';

export const explainerRegistry: ExplainerRegistry = {
	transformer: transformerConfig,
	'my-explainer': myExplainerConfig  // ⭐ Add here
};
```

---

### 7. Update Entry Point (1 min)

Modify `src/routes/+page.svelte`:

```svelte
<script lang="ts">
	import MyExplainerMain from '~/lib/explainers/my-explainer/components/MyExplainerMain.svelte';
</script>

<MyExplainerMain />
```

---

### 8. Test Build (2 min)

```bash
npm run dev
```

Visit `http://localhost:5173` and verify your explainer loads.

---

### 9. Add Specific Components (Remaining Time)

Create your explainer-specific components:

```bash
# Layer visualization
touch src/lib/explainers/my-explainer/components/LayerVisualization.svelte

# Input panel
touch src/lib/explainers/my-explainer/components/InputPanel.svelte

# Specific popovers
touch src/lib/explainers/my-explainer/components/Popovers/LayerPopover.svelte
```

**Example LayerVisualization.svelte:**

```svelte
<script lang="ts">
	import Matrix from '~/lib/shared/components/Matrix.svelte';
	import { currentLayerData } from '../store';

	$: weights = $currentLayerData?.weights || [];
</script>

{#if weights.length > 0}
	<div class="layer-viz">
		<h3>Layer Weights</h3>
		<Matrix
			data={weights}
			cellHeight={15}
			cellWidth={15}
			colorScale="coolwarm"
		/>
	</div>
{/if}

<style>
	.layer-viz {
		padding: 1rem;
		border: 1px solid #e5e7eb;
		border-radius: 0.5rem;
	}
</style>
```

---

## Tips & Tricks

### Reuse Shared Components

Always check `lib/shared/components/` before creating new components:

- ✅ **Matrix**: For weight matrices, feature maps
- ✅ **VectorCanvas**: For embeddings, activations
- ✅ **Slider**: For layer selection, hyperparameters
- ✅ **CommonPopover**: For educational tooltips

### Follow Naming Conventions

```
Components:     PascalCase    (LayerVisualization.svelte)
Utilities:      camelCase     (computeActivations.ts)
Constants:      UPPER_SNAKE   (MAX_LAYERS)
Stores:         camelCase     (selectedLayer)
```

### Use Tailwind Classes

```svelte
<!-- Prefer Tailwind utilities -->
<div class="flex gap-4 p-6 bg-gray-100 rounded-lg">
	<!-- content -->
</div>

<!-- Use SCSS only for complex styles -->
<style lang="scss">
	.custom-gradient {
		background: linear-gradient(45deg, var(--color-1), var(--color-2));
	}
</style>
```

### Optimize Performance

- Use **Canvas** for >1000 elements
- Use **SVG** for <1000 interactive elements
- **Debounce** expensive computations
- **Lazy load** heavy components

```typescript
import { debounce } from 'lodash-es';

const updateViz = debounce(() => {
	// Expensive rendering
}, 100);
```

### Add Educational Content

```svelte
<CommonPopover
	id="convolution-explanation"
	triggeredBy="conv-layer"
	title="Convolution Operation"
>
	<p>
		Convolution applies a sliding window (kernel) over the input...
	</p>
	<img src="/images/convolution.svg" alt="Convolution diagram" />
</CommonPopover>
```

---

## Common Patterns

### Pattern 1: Layer Navigation

```svelte
<script>
	import { selectedLayer, modelData } from '../store';

	function nextLayer() {
		selectedLayer.update(n => Math.min(n + 1, $modelData.layers.length - 1));
	}

	function prevLayer() {
		selectedLayer.update(n => Math.max(n - 1, 0));
	}
</script>

<div class="layer-nav">
	<button on:click={prevLayer}>Previous</button>
	<span>Layer {$selectedLayer + 1}</span>
	<button on:click={nextLayer}>Next</button>
</div>
```

### Pattern 2: Loading States

```svelte
<script>
	import { isModelRunning } from '../store';
	import LoadingDots from '~/lib/shared/components/LoadingDots.svelte';
</script>

{#if $isModelRunning}
	<LoadingDots />
{:else}
	<ModelVisualization />
{/if}
```

### Pattern 3: Responsive Sizing

```svelte
<script>
	let containerHeight = 0;

	$: cellSize = Math.max(10, Math.min(containerHeight / 20, 30));
</script>

<div bind:offsetHeight={containerHeight} class="container">
	<Matrix cellHeight={cellSize} cellWidth={cellSize} {data} />
</div>
```

---

## Checklist

Before submitting your explainer:

- [ ] All shared components used where possible
- [ ] TypeScript types defined
- [ ] Responsive design (mobile-friendly)
- [ ] Loading states handled
- [ ] Error states handled
- [ ] Educational popovers added
- [ ] Example inputs provided
- [ ] Documentation updated
- [ ] Code formatted (`npm run format`)
- [ ] Build succeeds (`npm run build`)
- [ ] Tested in Chrome, Firefox, Safari

---

## Example: CNN Explainer Outline

Here's a complete outline for a CNN explainer:

```
src/lib/explainers/cnn/
├── components/
│   ├── CNNMain.svelte              # Main container
│   ├── InputImage.svelte           # Image input panel
│   ├── ConvLayer.svelte            # Convolution visualization
│   ├── PoolingLayer.svelte         # Pooling visualization
│   ├── FCLayer.svelte              # Fully connected layer
│   ├── ActivationMap.svelte        # Feature map visualization
│   ├── KernelView.svelte           # Kernel/filter visualization
│   ├── ClassificationOutput.svelte # Prediction results
│   └── Popovers/
│       ├── ConvolutionPopover.svelte
│       ├── PoolingPopover.svelte
│       └── ActivationPopover.svelte
├── utils/
│   ├── data.ts                     # Model inference
│   ├── imageProcessing.ts          # Image preprocessing
│   └── visualization.ts            # CNN-specific viz helpers
├── constants/
│   └── examples/                   # Precomputed examples
│       ├── cat.js
│       └── dog.js
├── store/
│   └── index.ts                    # CNN stores
├── types/
│   └── cnn.d.ts                    # CNN type definitions
└── config.ts                       # CNN configuration
```

---

## Resources

- **Architecture Doc**: See `ARCHITECTURE.md` for detailed explanation
- **Shared Components**: `src/lib/shared/components/`
- **Type Definitions**: `src/lib/shared/types/explainer.d.ts`
- **Reference Implementation**: `src/lib/explainers/transformer/`

---

**Need Help?**

1. Check `ARCHITECTURE.md`
2. Review transformer explainer implementation
3. Open a GitHub issue

**Good luck building your explainer! 🚀**
