import BaseMacro from './model/BaseMacro';
import {decompress} from './compress';

class GraphMacroViewer extends BaseMacro {

  // eslint-disable-next-line
  constructor(ap = AP) {
    super(ap, 'graph');
  }

  async load() {
    const result = await super.load();
    if(result.compressed) {
      result.graphXml = decompress(result.graphXml);
    }

    return result;
  }
}

export default GraphMacroViewer