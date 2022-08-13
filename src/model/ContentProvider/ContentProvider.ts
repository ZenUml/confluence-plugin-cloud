import {StorageProvider} from "@/model/ContentProvider/StorageProvider";
import {IdProvider} from "@/model/ContentProvider/IdProvider";

export class ContentProvider {
  private _idProvider: IdProvider | undefined;
  private _storageProvider: StorageProvider;

  constructor(idProvider: IdProvider | undefined, storageProvider: StorageProvider) {
    this._idProvider = idProvider;
    this._storageProvider = storageProvider;
  }

  async load() {
    const id = await this._idProvider?.getId();
    const doc = await this._storageProvider.getDiagram(id);
    return {id, doc}
  }
}