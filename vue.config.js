var HtmlWebpackPlugin = require('html-webpack-plugin')

var version = process.env.VERSION || 'latest'
var product_type = process.env.PRODUCT_TYPE

module.exports = {
  assetsDir: version,
  productionSourceMap: false,
  configureWebpack: {
    resolve: {
      alias: {
        // 'vue$': 'vue/dist/vue.esm.js' // Full version with template compiler
      }
    }
  },
  devServer: {
    before: function (app) {
      app.get(/installed/, function (req, res) {
        res.status(200).send(`OK`);
      })
      app.get(/uninstalled/, function (req, res) {
        res.status(200).send(`OK`);
      })
    }
  },
  chainWebpack: config => {
    config
      .plugin('viewer-html')
      .use(HtmlWebpackPlugin, [{
        filename: `./${version}/view.html`,
        template: './public/view.html',
        inject: true,
        product_type: product_type
      }])
    config
      .plugin('editor-html')
      .use(HtmlWebpackPlugin, [{
        filename: `./${version}/edit.html`,
        template: './public/edit.html',
        inject: true,
        product_type: product_type
      }])

    config
      .plugin('copy')
      .tap(args => {
        // constructor parameter for 'CopyWebpackPlugin'
        args[0][0].ignore.push('view.html')
        args[0][0].ignore.push('edit.html')
        args[0][0].to = `${version}/`
        return args
      })
  }
};