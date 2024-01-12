import path, {resolve} from 'path';
import {defineConfig, splitVendorChunkPlugin} from 'vite';
import createVuePlugin from '@vitejs/plugin-vue';
import {execSync} from "child_process";
import fs from 'fs'

process.env.VUE_APP_GIT_HASH = execSync('git rev-parse --short HEAD').toString().trim()
process.env.VUE_APP_GIT_BRANCH = execSync('git branch --show-current').toString().trim()
// https://stackoverflow.com/a/45993185/529187
process.env.VUE_APP_GIT_TAG = execSync('git describe --tags --always --abbrev=0').toString().trim()
console.log(`Building ${process.env.VUE_APP_GIT_TAG} (${process.env.VUE_APP_GIT_HASH}) on ${process.env.VUE_APP_GIT_BRANCH}`)

function getHtmlFiles(dir) {
  const htmlFiles = [];
  const files = fs.readdirSync(dir);

  for (let i = 0; i < files.length; i++) {
    const filepath = path.join(dir, files[i]);
    if (fs.lstatSync(filepath).isFile()) {
      if (path.extname(filepath) === '.html') {
        htmlFiles.push(filepath);
      }
    }
  }
  return htmlFiles;
}

export default defineConfig({
  build: {
    rollupOptions: {
      input: getHtmlFiles('./').concat(getHtmlFiles('./drawio')),
      output: {
        // TODO: improve the strategy
        manualChunks(id) {
          if ((id.includes('node_modules') && id.includes('swagger'))) {
            return 'swagger'
          }

          if (id.includes('mermaid')) {
            return 'mermaid'
          }

          if (id.includes('lodash')) {
            return 'lodash'
          }

          if (id.includes('mixpanel')) {
            return 'mixpanel'
          }

          if (id.includes('codemirror')) {
            return 'codemirror'
          }

          if (id.includes('@zenuml/core')) {
            return '@zenuml/core'
          }
        }
      }
    },
    emptyOutDir: true,
  },
  resolve: {
    alias: {
      'vue': '@vue/compat',
      '@': resolve(__dirname, './src')
    },
  },
  plugins: [
    splitVendorChunkPlugin(),
    createVuePlugin({
      template: {
        compilerOptions: {
          compatConfig: {
            MODE: 2,
          },
        },
      },
    }),
  ],
  test: {
    environment: 'jsdom',
    globals: true,
    deps: {
      inline: ['@vue/test-utils'],
    },
  },
  server: {
    host: '0.0.0.0',
    port: 8080,
    proxy: {
      '/descriptor': {
        target: 'http://127.0.0.1:8788/',
        changeOrigin: false,
      },
      '/atlassian-connect-lite.json': {
        target: 'http://127.0.0.1:8788/',
        changeOrigin: true
      },
      '/installed': {
        target: 'http://127.0.0.1:8788/',
        changeOrigin: true
      },
      '/uninstalled': {
        target: 'http://127.0.0.1:8788/',
        changeOrigin: true
      },
      '/attachment': {
        target: 'http://127.0.0.1:8788/',
        changeOrigin: true
      }
    }
  }
});