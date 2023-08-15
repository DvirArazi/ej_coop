import { defineConfig } from 'vite';
import { sveltekit } from '@sveltejs/kit/vite';
// import type http from 'http';
// import initSocketIoServer from './src/lib/server/socketIoServer';
import { bla } from './bla';

export default defineConfig({
	plugins: [
		sveltekit(),
		{
			name: 'vite-plugin-socket-io',
			configureServer: (server) => {
				bla(server)
			},
		},
	],
});