var HtmlWebpackPlugin = require('html-webpack-plugin')
var productType = process.env.PRODUCT_TYPE

module.exports = {
  productionSourceMap: false,
  configureWebpack: {
    resolve: {
      alias: {
        // 'vue$': 'vue/dist/vue.esm.js' // Full version with template compiler
      }
    }
  },
  devServer: {
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
  },
  chainWebpack: config => {
    config
      .plugin('viewer-html')
      .use(HtmlWebpackPlugin, [{
        filename: `./view.html`,
        template: './public/view.html',
        inject: true,
        product_type: productType
      }])
    config
      .plugin('sequence-editor-html')
      .use(HtmlWebpackPlugin, [{
        filename: `./sequence-editor.html`,
        template: './public/sequence-editor.html',
        inject: true,
        product_type: productType
      }])    
    config
      .plugin('drawio-viewer-html')
      .use(HtmlWebpackPlugin, [{
        filename: `./drawio/viewer.html`,
        template: './public/drawio/viewer.html',
        inject: true,
        product_type: productType
      }])
    config
      .plugin('drawio-editor-html')
      .use(HtmlWebpackPlugin, [{
        filename: `./drawio/editor.html`,
        template: './public/drawio/editor.html',
        inject: true,
        product_type: productType
      }])
  }
};