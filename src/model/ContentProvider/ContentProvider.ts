import {StorageProvider} from "@/model/ContentProvider/StorageProvider";
import {IdProvider} from "@/model/ContentProvider/IdProvider";
import {Diagram} from "@/model/Diagram/Diagram";

export interface IContentProvider {
  load(): Promise<{ id: string | undefined, doc: Diagram }>;
}

export class ContentProvider implements IContentProvider {
  private _idProvider: IdProvider | undefined;
  private _storageProvider: StorageProvider;

  constructor(idProvider: IdProvider | undefined, storageProvider: StorageProvider) {
    this._idProvider = idProvider;
    this._storageProvider = storageProvider;
  }

  async load(): Promise<{ id: string | undefined, doc: Diagram }> {
    const id = await this._idProvider?.getId();
    const doc = await this._storageProvider.getDiagram(id);
    return {id, doc}
  }
}