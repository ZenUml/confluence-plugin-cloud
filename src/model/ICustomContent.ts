import {Diagram} from "@/model/Diagram/Diagram";
import { ICustomContentResponseBodyV2 } from "./ICustomContentResponseBody";

export interface ICustomContent {
  container?: { id: string, type: string, title?: string, link?: string };
  space: { key: string };
  id?: string;
  version?: { number: number };
  title?: string;
  type?: string;
  value: Diagram;
  author?: User;
  contributors?:Array<User>;
}

export class User {
   id: string='';
   name: string='';
   avatar: string='';
   link: string ='';
}

export interface ICustomContentV2 extends ICustomContentResponseBodyV2 {
  value: Diagram;
}

export interface SearchResults {
  size: number;
  results: Array<ICustomContent>;
  _links?: {context: string, next?: string}
}