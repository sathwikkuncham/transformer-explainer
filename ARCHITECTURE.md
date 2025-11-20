# Multi-Explainer Architecture

This document describes the new modular architecture for supporting multiple AI explainers (Transformer, CNN, GAN, Diffusion, etc.) with shared UI components and consistent look & feel.

## Table of Contents

1. [Overview](#overview)
2. [Directory Structure](#directory-structure)
3. [Core Concepts](#core-concepts)
4. [Adding a New Explainer](#adding-a-new-explainer)
5. [Shared Components](#shared-components)
6. [Design System](#design-system)
7. [Best Practices](#best-practices)

---

## Overview

The codebase has been refactored to support multiple explainers while maintaining:

- **Shared UI components** - Reusable visualization primitives (Matrix, VectorCanvas, etc.)
- **Consistent design** - Tailwind-based design system with unified look & feel
- **Modular architecture** - Each explainer is self-contained with its own components, store, and logic
- **Type-safe configuration** - ExplainerConfig interface ensures consistency

### Architecture Philosophy

**Fork & Adapt Approach**: Each explainer is self-contained in its own folder (`lib/explainers/{name}/`), allowing independent evolution while sharing common UI components.

---

## Directory Structure

```
src/
├── lib/
│   ├── shared/                          # Shared across all explainers
│   │   ├── components/                  # ✅ Reusable UI components
│   │   │   ├── Matrix.svelte           # 2D matrix visualization
│   │   │   ├── MatrixSvg.svelte        # SVG-based matrix rendering
│   │   │   ├── VectorCanvas.svelte     # Canvas-based vector viz
│   │   │   ├── Slider.svelte            # Parameter sliders
│   │   │   ├── CommonPopover.svelte     # Base popover component
│   │   │   ├── LoadingDots.svelte       # Loading indicators
│   │   │   ├── Arrow.svelte             # SVG arrows
│   │   │   ├── TokenVector.svelte       # Token visualization
│   │   │   ├── WeightPopoverCard.svelte # Weight matrix cards
│   │   │   ├── TextbookTooltip.svelte   # Educational tooltips
│   │   │   └── HelpPopover.svelte       # Help popovers
│   │   ├── utils/                       # Shared utility functions
│   │   │   ├── array.ts                 # Array manipulation
│   │   │   ├── event.ts                 # Analytics/event tracking
│   │   │   ├── gsap.ts                  # GSAP animation helpers
│   │   │   └── fetchChunks.js           # Model chunk loading
│   │   ├── types/                       # Shared type definitions
│   │   │   ├── global.d.ts              # Global types
│   │   │   └── explainer.d.ts           # ⭐ ExplainerConfig interface
│   │   ├── constants/                   # Shared constants
│   │   │   ├── gradient.ts              # Color gradients
│   │   │   └── opacity.ts               # Opacity values
│   │   └── styles/                      # Shared styles
│   │       ├── variables.scss           # SCSS variables (z-index, etc.)
│   │       └── global.scss              # Global styles
│   │
│   └── explainers/                      # Explainer-specific code
│       ├── registry.ts                  # ⭐ Central explainer registry
│       │
│       └── transformer/                 # Transformer explainer
│           ├── config.ts                # ⭐ Transformer configuration
│           ├── components/              # Transformer-specific components
│           │   ├── TransformerMain.svelte  # Main visualization
│           │   ├── Embedding.svelte
│           │   ├── QKV.svelte
│           │   ├── Attention.svelte
│           │   ├── AttentionMatrix.svelte
│           │   ├── HeadStack.svelte
│           │   ├── Mlp.svelte
│           │   ├── LinearSoftmax.svelte
│           │   ├── SubsequentBlocks.svelte
│           │   ├── BlockTransition.svelte
│           │   ├── Operation.svelte
│           │   ├── OperationGroup.svelte
│           │   ├── Sankey.svelte
│           │   ├── WeightPopovers.svelte
│           │   ├── ProbabilityBars.svelte
│           │   ├── Sampling.svelte
│           │   ├── Temperature.svelte
│           │   ├── InputForm.svelte
│           │   ├── Topbar.svelte
│           │   ├── Header.svelte
│           │   ├── Alert.svelte
│           │   ├── Katex.svelte
│           │   ├── textbook/            # Guided tour
│           │   │   ├── Textbook.svelte
│           │   │   ├── TextbookCard.svelte
│           │   │   └── TextbookNavigation.svelte
│           │   ├── article/             # Documentation
│           │   │   └── Article.svelte
│           │   └── Popovers/            # Transformer-specific popovers
│           │       ├── ActivationPopover.svelte
│           │       ├── AttentionWeightPopover.svelte
│           │       ├── DropoutPopover.svelte
│           │       ├── LayerNormPopover.svelte
│           │       ├── LogitWeightPopover.svelte
│           │       ├── MLPDownWeightPopover.svelte
│           │       ├── MLPWeightPopover.svelte
│           │       ├── PositionalEncodingPopover.svelte
│           │       ├── QKVWeightPopover.svelte
│           │       ├── ResidualPopover.svelte
│           │       └── SoftmaxPopover.svelte
│           ├── utils/                   # Transformer-specific utils
│           │   ├── data.ts              # Model execution
│           │   ├── animation.ts         # GSAP animations
│           │   ├── textbook.ts          # Textbook logic
│           │   └── textbookPages.ts     # Textbook content
│           ├── constants/               # Transformer constants
│           │   └── examples/            # Pre-computed examples
│           │       ├── ex0.js
│           │       ├── ex1.js
│           │       ├── ex2.js
│           │       ├── ex3.js
│           │       ├── ex4.js
│           │       └── index.js
│           ├── store/                   # Transformer Svelte stores
│           │   └── index.ts
│           └── types/                   # Transformer types
│               └── transformer.d.ts
│
├── routes/
│   ├── +layout.svelte                  # Main app layout
│   ├── +page.svelte                    # ⭐ Entry point (uses TransformerMain)
│   └── +page.ts                        # Page load logic
│
├── components/                          # Legacy (being migrated)
├── constants/                           # Legacy (being migrated)
├── store/                               # Legacy (being migrated)
├── types/                               # Legacy (being migrated)
└── utils/                               # Legacy (being migrated)
```

---

## Core Concepts

### 1. ExplainerConfig Interface

Every explainer must implement the `ExplainerConfig` interface defined in `lib/shared/types/explainer.d.ts`:

```typescript
export interface ExplainerConfig {
	id: string;                          // Unique identifier
	name: string;                        // Display name
	description: string;                 // Short description
	icon?: string;                       // Emoji or icon
	theme?: {                            // Color theme
		primary: string;
		secondary: string;
		accent: string;
	};
	modelMeta: ExplainerModelMeta;       // Model metadata
	components: ExplainerComponents;      // Component registry
	dataProcessing: ExplainerDataProcessing;  // Data pipeline
	stores: ExplainerStores;             // Store management
	examples: ExplainerExample[];        // Example data
}
```

### 2. Explainer Registry

The `lib/explainers/registry.ts` file is the central registry for all explainers:

```typescript
export const explainerRegistry: ExplainerRegistry = {
	transformer: transformerConfig,
	// Future explainers:
	// cnn: cnnConfig,
	// gan: ganConfig,
	// diffusion: diffusionConfig
};
```

### 3. Component Organization

**Shared Components** (`lib/shared/components/`):
- Generic, reusable across all explainers
- No explainer-specific logic
- Props-based configuration

**Explainer Components** (`lib/explainers/{name}/components/`):
- Specific to one explainer
- Can import shared components
- Encapsulates domain-specific logic

---

## Adding a New Explainer

Follow these steps to add a new explainer (e.g., CNN Explainer):

### Step 1: Create Directory Structure

```bash
mkdir -p src/lib/explainers/cnn/{components,utils,constants,store,types}
```

### Step 2: Define Configuration

Create `src/lib/explainers/cnn/config.ts`:

```typescript
import type { ExplainerConfig } from '~/lib/shared/types/explainer';
import CNNMain from './components/CNNMain.svelte';
import CNNInput from './components/CNNInput.svelte';
// ... import other components

export const cnnConfig: ExplainerConfig = {
	id: 'cnn',
	name: 'CNN Explainer',
	description: 'Interactive visualization of Convolutional Neural Networks',
	icon: '🖼️',
	theme: {
		primary: '#10b981', // green-500
		secondary: '#3b82f6', // blue-500
		accent: '#f59e0b' // amber-500
	},

	modelMeta: {
		models: {
			'lenet': { layer_num: 5, ... },
			'alexnet': { layer_num: 8, ... }
		},
		defaultModel: 'lenet'
	},

	components: {
		MainComponent: CNNMain,
		InputComponent: CNNInput,
		// ... other components
	},

	dataProcessing: {
		initialize: async () => {
			// Initialize CNN model
		},
		runModel: async (input, options) => {
			// Run CNN inference
		},
		// ... other methods
	},

	stores: {
		// Define Svelte stores
		modelData: writable(null),
		input: writable(null),
		ui: { ... },
		model: { ... },
		initialize: () => { ... },
		reset: () => { ... }
	},

	examples: [
		{ id: 0, label: 'Cat', input: '...', precomputedOutput: ... },
		{ id: 1, label: 'Dog', input: '...', precomputedOutput: ... }
	]
};
```

### Step 3: Create Main Component

Create `src/lib/explainers/cnn/components/CNNMain.svelte`:

```svelte
<script lang="ts">
	import { onMount } from 'svelte';
	import Matrix from '~/lib/shared/components/Matrix.svelte';
	import VectorCanvas from '~/lib/shared/components/Vector Canvas.svelte';
	// ... import other shared components

	import { modelData, input } from '../store';
	import ConvLayer from './ConvLayer.svelte';
	import PoolingLayer from './PoolingLayer.svelte';
	// ... import CNN-specific components

	onMount(async () => {
		// Initialize CNN explainer
	});
</script>

<div class="cnn-main">
	<!-- Your CNN visualization here -->
	<ConvLayer />
	<PoolingLayer />
	<!-- Use shared components -->
	<Matrix data={$modelData.weights} cellHeight={20} cellWidth={20} />
</div>

<style lang="scss">
	.cnn-main {
		/* Your styles */
	}
</style>
```

### Step 4: Register Explainer

Add to `src/lib/explainers/registry.ts`:

```typescript
import { cnnConfig } from './cnn/config';

export const explainerRegistry: ExplainerRegistry = {
	transformer: transformerConfig,
	cnn: cnnConfig  // ⭐ Add new explainer
};
```

### Step 5: Update Entry Point

Modify `src/routes/+page.svelte` to use the new explainer:

```svelte
<script lang="ts">
	import CNNMain from '~/lib/explainers/cnn/components/CNNMain.svelte';
</script>

<CNNMain />
```

### Step 6: Create Stores

Create `src/lib/explainers/cnn/store/index.ts`:

```typescript
import { writable, derived } from 'svelte/store';

export const modelData = writable(null);
export const input = writable(null);
export const selectedLayer = writable(0);
// ... other CNN-specific stores
```

### Step 7: Implement Utilities

Create utility functions in `src/lib/explainers/cnn/utils/`:
- `data.ts` - Model execution, data processing
- `animation.ts` - Visualization animations
- `cnn.ts` - CNN-specific logic

---

## Shared Components

All shared components are in `lib/shared/components/`. Use these to maintain consistent UI:

### Matrix Component

Generic 2D matrix visualization:

```svelte
<Matrix
	data={[[1, 2], [3, 4]]}
	cellHeight={20}
	cellWidth={20}
	shape="rect"  // or "circle"
	colorScale="viridis"  // or custom function
	onMouseOverCell={(e, data) => { /* handler */ }}
	highlightRow={0}
	highlightCol={1}
/>
```

**Props**:
- `data: number[][]` - Matrix data
- `cellHeight: number` - Cell height in pixels
- `cellWidth: number` - Cell width in pixels
- `rowGap?: number` - Gap between rows
- `colGap?: number` - Gap between columns
- `groupBy?: 'row' | 'col'` - Grouping direction
- `shape?: 'circle' | 'rect'` - Cell shape
- `colorScale?: string | ((t: number) => any)` - Color mapping
- `transpose?: boolean` - Transpose matrix
- `onMouseOverCell?: (event, data, el) => void` - Mouse over handler
- `onMouseOutCell?: (event, data, el) => void` - Mouse out handler
- `highlightRow?: number` - Highlighted row index
- `highlightCol?: number` - Highlighted column index

### VectorCanvas Component

Canvas-based vector visualization with gradients:

```svelte
<VectorCanvas
	data={[0.1, 0.5, 0.9, 0.3]}
	height={100}
	width={12}
	colorScale={d3.interpolateViridis}
/>
```

**Props**:
- `data: number[]` - Vector data
- `height: number` - Canvas height
- `width: number` - Canvas width
- `colorScale: (t: number) => string` - Color interpolation function

### Slider Component

Parameter control slider:

```svelte
<Slider
	bind:value={temperature}
	min={0}
	max={2}
	step={0.1}
	label="Temperature"
/>
```

### CommonPopover Component

Base popover for educational content:

```svelte
<CommonPopover
	title="Attention Mechanism"
	triggeredBy="attention-btn"
	placement="right"
>
	<p>Attention allows the model to focus on relevant parts...</p>
</CommonPopover>
```

---

## Design System

### Color Palette

The design system uses Tailwind CSS with predefined semantic colors:

```javascript
// tailwind.config.js
{
	colors: {
		blue: { 300, 500, 600, 800, ... },    // Query (Transformer)
		red: { 300, 600, ... },                // Key (Transformer)
		green: { 300, ... },                   // Value (Transformer)
		purple: { 200, 300, 600, ... },        // Output/MLP
		gray: { 100-900 },                     // UI elements
		cyan: { custom palette }
	}
}
```

### Spacing & Sizing

- `rootRem`: 16px base unit
- `vectorHeight`: Dynamic based on content (12-30px)
- Grid layouts: CSS Grid for responsive components

### Typography

- Body: Default system font
- Code/Data: Monospace
- Titles: Bold, gray-400
- Labels: 0.9rem, gray-700

### Z-Index Management

Z-index values are centralized in `lib/shared/styles/variables.scss`:

```scss
$VECTOR_INDEX: 10;
$COLUMN_TITLE_INDEX: 20;
$POPOVER_INDEX: 1000;
$TOOLTIP_INDEX: 2000;
$DIM_INDEX: 5000;
```

---

## Best Practices

### 1. Import Paths

Use the `~` alias for absolute imports:

```typescript
// ✅ Good
import Matrix from '~/lib/shared/components/Matrix.svelte';
import { modelData } from '../store';

// ❌ Bad
import Matrix from '../../../lib/shared/components/Matrix.svelte';
```

### 2. Component Organization

**Keep components focused**:
- One responsibility per component
- Break down large components (>500 lines)
- Extract reusable logic to utilities

**Naming conventions**:
- Components: PascalCase (`Matrix.svelte`)
- Utilities: camelCase (`data.ts`)
- Constants: UPPER_SNAKE_CASE (`MAX_TOKENS`)

### 3. Store Management

**Each explainer manages its own stores**:
- Don't share stores between explainers
- Use derived stores for computed values
- Reset stores when switching explainers

```typescript
// ✅ Good - Explainer-specific store
export const transformerData = writable(null);

// ❌ Bad - Global store shared by all
export const globalData = writable(null);
```

### 4. Styling

**Use Tailwind utilities first**, SCSS for complex styles:

```svelte
<!-- ✅ Good -->
<div class="flex gap-4 p-6 bg-gray-100">
	<!-- content -->
</div>

<style lang="scss">
	/* Complex animations and pseudo-selectors */
	.custom-animation {
		animation: fadeIn 0.5s ease-in;
	}
</style>
```

### 5. Type Safety

**Always define types** for complex data structures:

```typescript
// ✅ Good
type ConvLayerOutput = {
	activations: number[][][];
	kernels: number[][][][];
	biases: number[];
};

// ❌ Bad
let output: any;
```

### 6. Performance

**Optimize visualizations**:
- Use Canvas for large datasets (>1000 elements)
- Use SVG for interactive elements
- Debounce expensive computations
- Lazy load components when possible

```typescript
import { debounce } from 'lodash-es';

const updateVisualization = debounce(() => {
	// Expensive rendering
}, 100);
```

### 7. Accessibility

**Ensure accessibility**:
- Add ARIA labels to interactive elements
- Provide keyboard navigation
- Include alt text for images
- Maintain sufficient color contrast

```svelte
<button
	aria-label="Expand attention layer"
	on:click={expandLayer}
	on:keypress={(e) => e.key === 'Enter' && expandLayer()}
>
	Expand
</button>
```

### 8. Documentation

**Document complex components**:
- Add JSDoc comments to functions
- Explain non-obvious logic
- Include usage examples

```typescript
/**
 * Computes attention scores using scaled dot-product attention
 * @param query - Query matrix [seq_len, d_k]
 * @param key - Key matrix [seq_len, d_k]
 * @param value - Value matrix [seq_len, d_v]
 * @returns Attention output [seq_len, d_v]
 */
export function computeAttention(query, key, value) {
	// Implementation
}
```

---

## Migration Status

### Completed ✅

- Created shared component library
- Moved Transformer explainer to new structure
- Defined ExplainerConfig interface
- Created explainer registry
- Updated import paths
- Created documentation

### Pending ⏳

- Migrate remaining components from `/components` to `/lib`
- Remove legacy folders after full migration
- Add CNN explainer as proof-of-concept
- Create explainer selector UI (if multiple explainers)
- Add unit tests for shared components

---

## Questions?

For questions or contributions, please:
1. Check this documentation
2. Review `lib/shared/types/explainer.d.ts` for interfaces
3. Look at `lib/explainers/transformer/` as reference implementation
4. Open an issue on GitHub

---

**Last Updated**: 2025-11-20
**Author**: AI Architecture Refactoring
