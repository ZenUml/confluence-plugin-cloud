import {Diagram} from "@/model/Diagram";

export interface IContentProperty {
  // 'value: string' is for very old macros.
  value: Diagram | string
}