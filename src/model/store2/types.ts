import {Diagram, DiagramType} from "@/model/Diagram/Diagram";

export interface RootState {
  diagram: Diagram
  mermaidCode: string | undefined,
  code: string | undefined,
  diagramType: DiagramType
}
