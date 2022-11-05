import {Diagram} from "@/model/Diagram/Diagram";

export interface ICustomContent {
  container?: { id: string, type: string, title?: string };
  space: { key: string };
  id?: string;
  version?: { number: number };
  title?: string;
  type?: string;
  value: Diagram;
}

export interface SearchResults {
  size: number;
  results: Array<ICustomContent>;
  _links?: {context: string, next?: string}
}