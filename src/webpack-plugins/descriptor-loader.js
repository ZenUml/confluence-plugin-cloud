const {DescriptorBuilder} = require("../descriptor/DescriptorBuilder");

module.exports = function(source) {
  const full = new DescriptorBuilder(JSON.parse(source)).full();
  this.emitFile(this.resourcePath.split('/').pop().split('.')[0] + '.json', JSON.stringify(full));
  const lite = new DescriptorBuilder(JSON.parse(source)).lite();
  this.emitFile(this.resourcePath.split('/').pop().split('.')[0] + '-lite.json', JSON.stringify(lite));
  return '';
}
