import BaseMacro from './BaseMacro';
import {compress, decompress} from '@/utils/compress';

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

  async save(code) {
    const compressedCode = compress(code);
    return super.save({graphXml: compressedCode, compressed: true});
  }
}

export default GraphMacro