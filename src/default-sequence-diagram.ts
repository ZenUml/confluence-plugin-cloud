import {DiagramType} from "@/model/Diagram/Diagram";
import Example from "@/utils/sequence/Example";

export function defaultSequenceDiagram() {
  return {
    diagramType: DiagramType.Sequence,
    code: Example.Sequence
  };
}

export default defaultSequenceDiagram();
