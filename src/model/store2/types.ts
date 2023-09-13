import {Diagram} from "@/model/Diagram/Diagram";

export interface RootState {
  diagram: Diagram
  error: any,
  onElementClick: Function
}
