import {Diagram} from "@/model/Diagram";

export interface ICustomContent {
  container?: { id: string, type: string };
  space: { key: string };
  id?: string;
  version?: { number: number };
  title?: string;
  type?: string;
  value: Diagram;
}