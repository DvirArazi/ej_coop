import { defineConfig } from 'vite';
import { sveltekit } from '@sveltejs/kit/vite';
import type http from 'http';
import initSocketIoServer from './src/lib/server/socketIoServer';

export default defineConfig({
	plugins: [
		sveltekit(),
		{
			name: 'vite-plugin-socket-io',
			configureServer: (server) => {
				initSocketIoServer(server.httpServer as http.Server);
			},
			configurePreviewServer(server) {
				initSocketIoServer(server.httpServer as http.Server);
			},
		},
	],
	resolve: {
		alias: {
			'/@src': './src'
		},
	},
});