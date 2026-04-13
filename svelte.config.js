import adapter from '@sveltejs/adapter-node';
import { vitePreprocess } from '@sveltejs/kit/vite';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://kit.svelte.dev/docs/integrations#preprocessors
	// for more information about preprocessors
	preprocess: vitePreprocess(),

	kit: {
		adapter: adapter(),

		typescript: {
			config: (generatedConfig) => {
				const { compilerOptions } = generatedConfig;

				if (!compilerOptions) return generatedConfig;

				delete compilerOptions.importsNotUsedAsValues;
				delete compilerOptions.preserveValueImports;
				compilerOptions.verbatimModuleSyntax = true;
				compilerOptions.moduleResolution = 'bundler';

				return generatedConfig;
			}
		},

		alias: {
			'/@src': 'src',
			'@src': 'src'
		},
	},
};

export default config;
