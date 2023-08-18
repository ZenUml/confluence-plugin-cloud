import {Diagram, DiagramType} from "@/model/Diagram/Diagram";

export interface RootState {
  diagram: Diagram
  diagramType: DiagramType,
  error: any,
  onElementClick: Function
}
