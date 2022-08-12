import BaseMacro from './BaseMacro2';
import {DiagramType} from "@/model/Diagram/Diagram";

class GraphMacro extends BaseMacro {
  async save2(code: string) {
    return super.save({diagramType: DiagramType.Graph, graphXml: code});
  }
}

export default GraphMacro