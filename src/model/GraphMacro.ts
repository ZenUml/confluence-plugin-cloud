import BaseMacro from './BaseMacro2';
import {decompress} from '@/utils/compress';
import {DiagramType} from "@/model/Diagram";

class GraphMacro extends BaseMacro {
  async load() {
    const result = await super.load();
    if(result.compressed) {
      result.graphXml = decompress(result.graphXml);
    }

    return result;
  }

  async save2(code: string) {
    return super.save({diagramType: DiagramType.Graph, graphXml: code});
  }
}

export default GraphMacro