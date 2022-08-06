const SpeedMeasureWebpackPlugin = require('speed-measure-webpack-plugin');
const { ESBuildMinifyPlugin } = require('esbuild-loader')

module.exports = {
  pages: {
    "index": {
      entry: 'src/main.ts',
      template: 'public/index.html',
      chunks: ['chunk-common', 'chunk-index-vendors', 'index']
    },
    "sequence-editor": {
      entry: 'src/sequence-editor.ts',
      template: 'public/sequence-editor.html',
      chunks: ['chunk-common', 'chunk-sequence-editor-vendors', 'sequence-editor']
    },
    "sequence-editor-dialog": {
      entry: 'src/sequence-editor-dialog.ts',
      template: 'public/sequence-editor-dialog.html',
      chunks: ['chunk-common', 'chunk-sequence-editor-dialog-vendors', 'sequence-editor-dialog']
    },
    "sequence-viewer": {
      entry: 'src/sequence-viewer.ts',
      template: 'public/sequence-viewer.html',
      chunks: ['chunk-common', 'chunk-sequence-viewer-vendors', 'sequence-viewer']
    },
    "sequence-viewer-dialog": {
      entry: 'src/sequence-viewer-dialog.ts',
      template: 'public/sequence-viewer-dialog.html',
      chunks: ['chunk-common', 'chunk-sequence-viewer-dialog-vendors', 'sequence-viewer-dialog']
    },
    "edit": {
      entry: 'src/sequence-editor.ts',
      template: 'public/sequence-editor.html',
      chunks: ['chunk-common', 'chunk-sequence-editor-vendors', 'sequence-editor']
    },
    "view": {
      entry: 'src/sequence-viewer.ts',
      template: 'public/sequence-viewer.html',
      chunks: ['chunk-common', 'chunk-sequence-viewer-vendors', 'sequence-viewer']
    },
    "graph-editor": {
      entry: 'src/graph-main-editor.ts',
      template: 'public/drawio/editor.html',
      filename: 'drawio/editor.html',
      chunks: ['chunk-common', 'chunk-graph-editor-vendors', 'graph-editor']
    },
    "graph-viewer": {
      entry: 'src/graph-main-viewer.ts',
      template: 'public/drawio/viewer.html',
      filename: 'drawio/viewer.html',
      chunks: ['chunk-common', 'chunk-graph-viewer-vendors', 'graph-viewer']
    },
    "swagger-editor": {
      entry: 'src/swagger-editor.ts',
      template: 'public/swagger-editor.html',
      chunks: ['chunk-common', 'chunk-swagger-editor-vendors', 'swagger-editor']
    },
    "swagger-ui": {
      entry: 'src/swagger-ui.ts',
      template: 'public/swagger-ui.html',
      chunks: ['chunk-common', 'chunk-swagger-ui-vendors', 'swagger-ui']
    },
    "embed-viewer": {
      entry: 'src/embed-viewer.ts',
      template: 'public/embed-viewer.html',
      chunks: ['chunk-common', 'chunk-embed-viewer-vendors', 'embed-viewer']
    },
    "embed-editor": {
      entry: 'src/embed-editor.ts',
      template: 'public/embed-editor.html',
      chunks: ['chunk-common', 'chunk-embed-editor-vendors', 'embed-editor']
    }
  },
  chainWebpack: config => {
    const rule = config.module.rule('js');
    // clear babel-loader
    rule.uses.clear()

    // add esbuild-loader
    rule.use('esbuild-loader').loader('esbuild-loader');

    const ruleTs = config.module.rule('ts');
    // clear babel-loader
    ruleTs.uses.clear()

    // add esbuild-loader
    ruleTs.use('esbuild-loader').loader('esbuild-loader')
      .options( {
          loader: 'ts', // 如果使用了 ts, 或者 vue 的 class 装饰器，则需要加上这个 option 配置， 否则会报错： ERROR: Unexpected "@"
          target: 'es2015',
          tsconfigRaw: require('./tsconfig.json')
        } );

    // 删除底层 terser, 换用 esbuild-minimize-plugin
    config.optimization.minimizers.delete('terser');

    // 使用 esbuild 优化 css 压缩
    config.optimization
      .minimizer('esbuild')
      .use(ESBuildMinifyPlugin, [{ minify: true, css: true }]);

    const options = module.exports
    const pages = options.pages
    const pageKeys = Object.keys(pages)
    const IS_VENDOR = /[\\/]node_modules[\\/]/
    config.optimization
      .splitChunks({
        cacheGroups: {
          vendors: {
            name: 'chunk-vendors',
            priority: -10,
            chunks: 'initial',
            minChunks: 1,
            test: IS_VENDOR,
            reuseExistingChunk: false, //        <<< THIS
            enforce: true,
          },
          ...pageKeys.map((key) => ({
            name: `chunk-${key}-vendors`,
            priority: -1, //                     <<< THIS
            chunks: (chunk) => chunk.name === key,
            minChunks: 1,
            test: IS_VENDOR,
            reuseExistingChunk: false, //        <<< THIS
            enforce: true,
          })),
          common: {
            name: 'chunk-common',
            priority: -20,
            chunks: 'initial',
            minChunks: 2,
            reuseExistingChunk: true,
            enforce: true,
          },
        },
      });
  },
  productionSourceMap: false,
  configureWebpack: {
    plugins: [
      new SpeedMeasureWebpackPlugin(),
    ],
    resolve: {
      fallback: {"stream": false},
      alias: {
        // 'vue$': 'vue/dist/vue.esm.js' // Full version with template compiler
      }
    }
  },
  devServer: {
    historyApiFallback: true,
    hot: true,
    host: '0.0.0.0',
    port: 8080,
    client: {
      webSocketURL: 'auto://0.0.0.0:0/ws',
    },
    proxy: {
      '/descriptor': {
        target: 'http://localhost:8788/',
        changeOrigin: true
      },
      '/atlassian-connect-lite.json': {
        target: 'http://localhost:8788/',
        changeOrigin: true
      },
      '/installed': {
        target: 'http://localhost:8788/',
        changeOrigin: true
      },
      '/uninstalled': {
        target: 'http://localhost:8788/',
        changeOrigin: true
      },
      '/attachment': {
        target: 'http://localhost:8788/',
        changeOrigin: true
      }
    },
    compress: true,  // This reduces the app.js from 4.8MB to 1.2MB
    onBeforeSetupMiddleware: function (devServer) {
      devServer.app.get(/installed/, function (req, res) {
        res.status(200).send(`OK`);
      })
      devServer.app.get(/uninstalled/, function (req, res) {
        res.status(200).send(`OK`);
      })
    },
    allowedHosts: "all",
  }
};