import {Diagram} from "@/model/Diagram";

export interface ICustomContent {
  container?: { id: string, type: string, title?: string };
  space: { key: string };
  id?: string;
  version?: { number: number };
  title?: string;
  type?: string;
  value: Diagram;
}