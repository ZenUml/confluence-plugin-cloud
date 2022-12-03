module.exports = function override(webpackConfig, env) {
  if(env === 'production') {
    webpackConfig.output.publicPath = '/asyncapi-viewer/';
  }

    return webpackConfig;
}