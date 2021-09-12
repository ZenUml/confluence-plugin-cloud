import BaseMacro from './BaseMacro2';
import {compress, decompress} from '@/utils/compress';

class GraphMacro extends BaseMacro {
  async load() {
    const result = await super.load();
    if(result.compressed) {
      result.graphXml = decompress(result.graphXml);
    }

    return result;
  }

  async save2(code: string) {
    const compressedCode = compress(code);
    return super.save({graphXml: compressedCode, compressed: true});
  }
}

export default GraphMacro