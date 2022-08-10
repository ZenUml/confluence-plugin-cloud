import {ContentProvider} from "@/model/ContentProvider/ContentProvider";
import {MacroIdProvider} from "@/model/ContentProvider/MacroIdProvider";
import AP from "@/model/AP";
import {CustomContentStorageProvider} from "@/model/ContentProvider/CustomContentStorageProvider";
import {ContentPropertyStorageProvider} from "@/model/ContentProvider/ContentPropertyStorageProvider";
import {MacroBodyStorageProvider} from "@/model/ContentProvider/MacroBodyStorageProvider";

export class CompositeContentProvider {
  private readonly _contentProviders: Array<ContentProvider>;

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

const defaultCompositeContentProvider = function getCompositeContentProvider() {
  const macroIdProvider = new MacroIdProvider(AP);
  const customContentStorageProvider = new CustomContentStorageProvider(AP);
  const ccContentProvider = new ContentProvider(macroIdProvider, customContentStorageProvider);
  const contentPropertyStorageProvider = new ContentPropertyStorageProvider(AP);
  const cpContentProvider = new ContentProvider(macroIdProvider, contentPropertyStorageProvider);
  const macroBodyStorageProvider = new MacroBodyStorageProvider(AP);
  const mbContentProvider = new ContentProvider(undefined, macroBodyStorageProvider);
  return new CompositeContentProvider([ccContentProvider, cpContentProvider, mbContentProvider]);
}

export default defaultCompositeContentProvider;
