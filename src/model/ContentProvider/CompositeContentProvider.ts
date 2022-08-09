import {ContentProvider} from "@/model/ContentProvider/ContentProvider";

export class CompositeContentProvider {
  private _contentProviders: Array<ContentProvider>;

  constructor(contentProviders: Array<ContentProvider>) {
    this._contentProviders = contentProviders;
  }

  async load(): Promise<any> {
    let content = {};
    for (const contentProvider of this._contentProviders) {
      try {
        content = await contentProvider.load();
        if (content) {
          return content;
        }
      } catch (e) {
        console.error(e);
      }
    }
    return content;
  }

}
