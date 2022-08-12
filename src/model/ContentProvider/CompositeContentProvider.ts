import {ContentProvider} from "@/model/ContentProvider/ContentProvider";
import {MacroIdProvider} from "@/model/ContentProvider/MacroIdProvider";
import {IAp} from "@/model/IAp";
import {CustomContentStorageProvider} from "@/model/ContentProvider/CustomContentStorageProvider";
import {ContentPropertyStorageProvider} from "@/model/ContentProvider/ContentPropertyStorageProvider";
import {MacroBodyStorageProvider} from "@/model/ContentProvider/MacroBodyStorageProvider";
import {NULL_DIAGRAM} from "@/model/Diagram/Diagram";

export class CompositeContentProvider {
  private readonly _contentProviders: Array<ContentProvider>;

  constructor(contentProviders: Array<ContentProvider>) {
    this._contentProviders = contentProviders;
  }

  async load(): Promise<any> {
    let content = {};
    for (const contentProvider of this._contentProviders) {
      try {
        const { id, doc } = await contentProvider.load();
        if (doc !== NULL_DIAGRAM) {
          return {id, doc};
        }
      } catch (e) {
        console.error(e);
      }
    }
    return content;
  }
}

const defaultCompositeContentProvider = function getCompositeContentProvider(ap: IAp) {
  const macroIdProvider = new MacroIdProvider(ap);
  const customContentStorageProvider = new CustomContentStorageProvider(ap);
  const ccContentProvider = new ContentProvider(macroIdProvider, customContentStorageProvider);
  const contentPropertyStorageProvider = new ContentPropertyStorageProvider(ap);
  const cpContentProvider = new ContentProvider(macroIdProvider, contentPropertyStorageProvider);
  const macroBodyStorageProvider = new MacroBodyStorageProvider(ap);
  const mbContentProvider = new ContentProvider(undefined, macroBodyStorageProvider);
  return new CompositeContentProvider([ccContentProvider, cpContentProvider, mbContentProvider]);
}

export default defaultCompositeContentProvider;
