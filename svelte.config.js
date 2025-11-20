// import adapter from '@sveltejs/adapter-auto';
import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://kit.svelte.dev/docs/integrations#preprocessors
	// for more information about preprocessors
	preprocess: vitePreprocess(),

	kit: {
		// adapter-auto only supports some environments, see https://kit.svelte.dev/docs/adapter-auto for a list.
		// If your environment is not supported, or you settled on a specific environment, switch out the adapter.
		// See https://kit.svelte.dev/docs/adapters for more information about adapters.
		adapter: adapter({
			pages: 'build',
			assets: 'build',
			fallback: null,
			precompress: false,
			strict: false // Ignore errors about dynamic routes
		}),
		prerender: {
			// List the specific routes to prerender
			entries: ['/' /* other routes if needed */],
			// Handle prerender errors gracefully (e.g., missing consent-form.pdf)
			handleHttpError: ({ path, referrer, message }) => {
				// Ignore 404 errors for missing static assets during prerendering
				if (path === '/transformer-explainer/consent-form.pdf') {
					console.warn(`Ignoring missing file: ${path}`);
					return;
				}
				// Throw other errors
				throw new Error(message);
			}
		},
		alias: {
			'~': './src'
		},
		paths: {
			base: process.env.NODE_ENV === 'production' ? '/transformer-explainer' : ''
		}
	}
};

export default config;
