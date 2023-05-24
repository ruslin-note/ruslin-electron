import { defineConfig } from 'vite';
import { resolve } from 'path';
import electron from 'vite-plugin-electron';
import solidPlugin from 'vite-plugin-solid';
import autoprefixer from 'autoprefixer';
import cssnano from 'cssnano';
const prefixer = require('postcss-variables-prefixer'); // Could not find a declaration file for module ...

export default defineConfig({
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'), // render
      'ruslin-addon': resolve(__dirname, './ruslin-addon'), // main
    },
  },
  css: {
    postcss: {
      plugins: [autoprefixer(), cssnano(), prefixer({ prefix: "fds-" })]
    }
  },
  plugins: [
    solidPlugin(),
    electron([
      {
        // Main-Process entry file of the Electron App.
        entry: 'electron/main.ts',
        onstart(options) {
          options.startup(['.', '--no-sandbox', '--ozone-platform-hint=auto', '--enable-wayland-ime'])
        },
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
