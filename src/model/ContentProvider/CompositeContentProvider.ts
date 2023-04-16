import {ContentProvider, IContentProvider} from "@/model/ContentProvider/ContentProvider";
import {MacroIdProvider} from "@/model/ContentProvider/MacroIdProvider";
import {CustomContentStorageProvider} from "@/model/ContentProvider/CustomContentStorageProvider";
import {ContentPropertyStorageProvider} from "@/model/ContentProvider/ContentPropertyStorageProvider";
import {MacroBodyStorageProvider} from "@/model/ContentProvider/MacroBodyStorageProvider";
import {Diagram, NULL_DIAGRAM} from "@/model/Diagram/Diagram";
import {getUrlParam, trackEvent} from "@/utils/window";
import {UrlIdProvider} from "@/model/ContentProvider/UrlIdProvider";
import {DialogCustomDataProvider} from "@/model/ContentProvider/DialogCustomDataProvider";
import ApWrapper2 from "@/model/ApWrapper2";
import globals from '@/model/globals';

export class CompositeContentProvider implements IContentProvider{
  private readonly _contentProviders: Array<ContentProvider>;

  constructor(contentProviders: Array<ContentProvider>) {
    this._contentProviders = contentProviders;
  }

  async load(): Promise<{ id: string | undefined, doc: Diagram }> {
    for (const contentProvider of this._contentProviders) {
      try {
        const { id, doc } = await contentProvider.load();
        if (doc !== NULL_DIAGRAM) {
          return {id, doc};
        }
      } catch (e: any) {
        console.error(e);
        trackEvent(JSON.stringify(e), 'load_macro', 'error')
      }
    }
    return {id: undefined, doc: NULL_DIAGRAM};
  }
}

const defaultContentProvider = function getCompositeContentProvider(apWrapper2: ApWrapper2): IContentProvider {
  const renderedFor = getUrlParam('rendered.for');
  const apWrapper = apWrapper2;

  if (renderedFor === 'custom-content-native') {
    const idProvider = globals.isEmbedded ? new UrlIdProvider() : new DialogCustomDataProvider(apWrapper);
    const customContentStorageProvider = new CustomContentStorageProvider(apWrapper);
    return new ContentProvider(idProvider, customContentStorageProvider);
  }
  
  const macroIdProvider = new MacroIdProvider(apWrapper);
  const customContentStorageProvider = new CustomContentStorageProvider(apWrapper);
  const ccContentProvider = new ContentProvider(macroIdProvider, customContentStorageProvider);
  const contentPropertyStorageProvider = new ContentPropertyStorageProvider(apWrapper);
  const cpContentProvider = new ContentProvider(macroIdProvider, contentPropertyStorageProvider);
  const macroBodyStorageProvider = new MacroBodyStorageProvider(apWrapper);
  const mbContentProvider = new ContentProvider(undefined, macroBodyStorageProvider);
  return new CompositeContentProvider([ccContentProvider, cpContentProvider, mbContentProvider]);
}

export default defaultContentProvider;
