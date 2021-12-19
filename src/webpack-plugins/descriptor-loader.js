module.exports = function(source) {
  
  this.emitFile(this.resourcePath.split('/').pop().split('.')[0] + '.json', source);
  return '';
}
