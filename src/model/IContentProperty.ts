import {Diagram} from "@/model/Diagram/Diagram";

export interface IContentProperty {
  // 'value: string' is for very old macros.
  value: Diagram | string;
  version?: { number: number };
}

export interface IContentPropertyNormalised {
  value: Diagram;
  version?: { number: number };
}