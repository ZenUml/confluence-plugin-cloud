import BaseMacro from './BaseMacro2';
import {compress, decompress} from '@/utils/compress';
import {DataSource, DiagramType} from "@/model/Diagram";

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
    return super.save({diagramType: DiagramType.Graph, source: DataSource.CustomContent, graphXml: compressedCode, compressed: true});
  }
}

export default GraphMacro