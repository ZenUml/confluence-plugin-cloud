import {MacroIdProvider} from "@/model/ContentProvider/MacroIdProvider";
import {StorageProvider} from "@/model/ContentProvider/StorageProvider";

export class ContentProvider {
  private _idProvider: MacroIdProvider;
  private _storageProvider: StorageProvider;

  constructor(idProvider: MacroIdProvider, storageProvider: StorageProvider) {
    this._idProvider = idProvider;
    this._storageProvider = storageProvider;
  }

  async load() {
    const id = await this._idProvider.getId();
    let content: Object | undefined;
    if (id) {
      content = await this._storageProvider.getContent(id);
    }
    return {id, content}
  }
}