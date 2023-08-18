import {Diagram, DiagramType} from "@/model/Diagram/Diagram";

export interface RootState {
  diagram: Diagram
  code: string | undefined,
  mermaidCode: string | undefined,
  diagramType: DiagramType,
  error: any,
  onElementClick: Function
}
