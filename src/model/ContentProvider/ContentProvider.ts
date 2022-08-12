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
    const doc = await this._storageProvider.getDiagram(id);
    return {id, doc}
  }
}