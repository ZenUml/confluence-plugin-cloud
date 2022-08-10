import {MacroIdProvider} from "@/model/ContentProvider/MacroIdProvider";
import {StorageProvider} from "@/model/ContentProvider/StorageProvider";

export class ContentProvider {
  private _idProvider: MacroIdProvider | undefined;
  private _storageProvider: StorageProvider;

  constructor(idProvider: MacroIdProvider | undefined, storageProvider: StorageProvider) {
    this._idProvider = idProvider;
    this._storageProvider = storageProvider;
  }

  async load() {
    const id = await this._idProvider?.getId();
    let content: Object | undefined;
    // content property provider relies on uuid as the key
    content = await this._storageProvider.getContent(id);
    return {id, content}
  }
}