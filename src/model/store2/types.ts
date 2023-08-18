import {Diagram, DiagramType} from "@/model/Diagram/Diagram";

export interface RootState {
  diagram: Diagram
  mermaidCode: string | undefined,
  mermaidSvg: string | undefined,
  code: string | undefined,
  diagramType: DiagramType,
  error: any,
  onElementClick: Function
}
