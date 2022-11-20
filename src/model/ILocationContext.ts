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