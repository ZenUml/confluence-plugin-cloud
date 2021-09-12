import BaseMacro from './BaseMacro2';
import {decompress} from '@/utils/compress';

class GraphMacro extends BaseMacro {

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

export default GraphMacro