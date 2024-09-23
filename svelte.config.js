import adapter from '@sveltejs/adapter-auto';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import path from 'path';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://kit.svelte.dev/docs/integrations#preprocessors
	// for more information about preprocessors
	preprocess: vitePreprocess(),

	kit: {
		// adapter-auto only supports some environments, see https://kit.svelte.dev/docs/adapter-auto for a list.
		// If your environment is not supported, or you settled on a specific environment, switch out the adapter.
		// See https://kit.svelte.dev/docs/adapters for more information about adapters.
		adapter: adapter(),
		alias: {
			$houdini: path.resolve('.', '$houdini'),

			$svc: path.resolve('.', 'src', 'services'),
			$cmps: path.resolve('.', 'src', 'components'),
			$modules: path.resolve('.', 'src', 'modules'),
			$data: path.resolve('.', 'src', 'data'),
			$lib: path.resolve('.', 'src', 'lib'),
			$assets: path.resolve('.', 'src', 'assets'),
			$routes: path.resolve('.', 'src', 'routes'),
			$cai: path.resolve('.', 'src', 'cai')
		}
	}
};

export default config;
