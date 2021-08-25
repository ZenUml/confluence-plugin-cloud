module.exports = {
  pages: {
    "index": {
      entry: 'src/main.ts',
      template: 'public/index.html',
      chunks: ['chunk-common', 'chunk-sequence-editor-vendors', 'sequence-editor']
    },
    "sequence-editor": {
      entry: 'src/sequence-editor.ts',
      template: 'public/sequence-editor.html',
      chunks: ['chunk-common', 'chunk-sequence-editor-vendors', 'sequence-editor']
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
    }
  },
  chainWebpack: config => {
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
    resolve: {
      alias: {
        // 'vue$': 'vue/dist/vue.esm.js' // Full version with template compiler
      }
    }
  },
  devServer: {
    disableHostCheck: true,
    historyApiFallback: true,
    hot: true,
    public: 'air.zenuml.com',
    host: 'localhost',
    port: 8080,
    sockHost: 'air.zenuml.com',
    sockPort: 443,
    compress: true,  // This reduces the app.js from 4.8MB to 1.2MB
    before: function (app) {
      app.get(/installed/, function (req, res) {
        res.status(200).send(`OK`);
      })
      app.get(/uninstalled/, function (req, res) {
        res.status(200).send(`OK`);
      })
    },
    allowedHosts: [
      '.zenuml.com'
    ]
  }
};