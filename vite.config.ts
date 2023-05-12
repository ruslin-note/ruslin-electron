import { defineConfig } from 'vite';
import { resolve } from 'path';
import electron from 'vite-plugin-electron';
import solidPlugin from 'vite-plugin-solid';
import renderer from 'vite-plugin-electron-renderer'

export default defineConfig({
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'), // render
      'ruslin-addon': resolve(__dirname, './ruslin-addon'), // main
    },
  },
  plugins: [
    solidPlugin(),
    renderer({
      resolve: {
        'ruslin-addon': { type: 'cjs' },
      },
    }),
    electron([
      {
        // Main-Process entry file of the Electron App.
        entry: 'electron/main.ts',
        vite: {
          build: {
            rollupOptions: {
              external: [/^.*\.node$/],
            },
          },
        },
      },
      {
        entry: 'electron/preload.ts',
        onstart(options) {
          // Notify the Renderer-Process to reload the page when the Preload-Scripts build is complete, 
          // instead of restarting the entire Electron App.
          options.reload()
        },
        vite: {
          build: {
            rollupOptions: {
              external: [/^.*\.node$/],
            },
          },
        },
      },
    ]),
  ],
})
