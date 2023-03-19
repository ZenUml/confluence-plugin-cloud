export interface ILocationContext {
  spaceKey: string;
  contentType: string;
  contentId: string;
  href: string;
  target: LocationTarget;
}

export enum LocationTarget {
  ContentView = 'contentview',
  ContentEdit = 'contentedit',
  ContentCreate = 'contentcreate'
}
export interface IContext {
  confluence: IConfluence;
}

export interface IConfluence {
  content: IContent;
  space: ISpace;
}
export interface IContent {
  plugin: string; //e.g. ac:my-api:async-api-doc
  type: string; //e.g. custom
}
export interface ISpace {
  key: string; //e.g. WHIMET4
  id: string; //e.g. 163841
}