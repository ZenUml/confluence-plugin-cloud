import BaseMacro from './BaseMacro';
import {decompress} from './compress';

class GraphMacroViewer extends BaseMacro {

  // eslint-disable-next-line
  constructor(ap = AP) {
    super(ap, 'graph', 'zenuml-content-graph');
  }

  async load() {
    const result = await super.load();
    if(result.compressed) {
      result.graphXml = decompress(result.graphXml);
    }

    if(result.graphXml !== result.code) {
      console.warn('WARN-301: The content stored in macro body and in content property are different.')
    }
    return result;
  }
}

export default GraphMacroViewer