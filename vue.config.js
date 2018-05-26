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
      .plugin('app-html')
      .use(HtmlWebpackPlugin, [{
        filename: 'view.html',
        template: './public/view.html',
        inject: true
      }])

    config
      .plugin('copy')
      .tap(args => {
        // constructor parameter for 'CopyWebpackPlugin'
        args[0][0].ignore.push('view.html')
        return args
      })
  }
};