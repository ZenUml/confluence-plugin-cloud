import {DiagramType} from "@/model/Diagram/Diagram";
import Example from "@/utils/sequence/Example";

export function defaultDiagram() {
  return {
    diagramType: DiagramType.Sequence,
    code: Example.Sequence,
    mermaidCode: Example.Mermaid,
  };
}

export default defaultDiagram();
