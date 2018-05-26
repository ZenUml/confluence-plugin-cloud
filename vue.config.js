var HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  configureWebpack: {
    resolve: {
      alias: {
        'vue$': 'vue/dist/vue.esm.js' // Full version with template compiler
      }
    }
  },

  chainWebpack: config => {
    config
      .plugin('viewer-html')
      .use(HtmlWebpackPlugin, [{
        filename: 'view.html',
        template: './public/view.html',
        inject: true
      }])
    config
      .plugin('editor-html')
      .use(HtmlWebpackPlugin, [{
        filename: 'edit.html',
        template: './public/edit.html',
        inject: true
      }])

    config
      .plugin('copy')
      .tap(args => {
        // constructor parameter for 'CopyWebpackPlugin'
        args[0][0].ignore.push('view.html')
        args[0][0].ignore.push('edit.html')
        return args
      })
  }
};