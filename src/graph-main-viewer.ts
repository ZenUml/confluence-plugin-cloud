import AP from "@/model/AP";
import createAttachmentIfContentChanged from "@/model/Attachment";
import {trackEvent} from "@/utils/window";
import '@/components/Debug/DebugMounter.ts'
import './assets/tailwind.css'
import globals from '@/model/globals';
import {MacroIdProvider} from "@/model/ContentProvider/MacroIdProvider";
import {CustomContentStorageProvider} from "@/model/ContentProvider/CustomContentStorageProvider";
import {ContentProvider} from "@/model/ContentProvider/ContentProvider";
import {ContentPropertyStorageProvider} from "@/model/ContentProvider/ContentPropertyStorageProvider";
import {MacroBodyStorageProvider} from "@/model/ContentProvider/MacroBodyStorageProvider";
import {CompositeContentProvider} from "@/model/ContentProvider/CompositeContentProvider";
import {decompress} from '@/utils/compress';

(async function initializeMacro() {
  const apWrapper = globals.apWrapper;
  await apWrapper.initializeContext();

  const macroIdProvider = new MacroIdProvider(AP);
  const customContentStorageProvider = new CustomContentStorageProvider(AP);
  const ccContentProvider = new ContentProvider(macroIdProvider, customContentStorageProvider);
  const contentPropertyStorageProvider = new ContentPropertyStorageProvider(AP);
  const cpContentProvider = new ContentProvider(macroIdProvider, contentPropertyStorageProvider);
  const macroBodyStorageProvider = new MacroBodyStorageProvider(AP);
  const mbContentProvider = new ContentProvider(undefined, macroBodyStorageProvider);
  const compositeContentProvider = new CompositeContentProvider([ccContentProvider, cpContentProvider, mbContentProvider]);
  const {content} = await compositeContentProvider.load();
  let graphXml = content.graphXml;
  if (content?.compressed) {
    graphXml = decompress(content.graphXml);
  }
  console.debug('graphXml', graphXml);
  if(graphXml) {
    // setGraphStyle is only available on viewer and maybe should only be used on viewer.
    // @ts-ignore
    setGraphStyle && setGraphStyle('styles/default.xml');
    // @ts-ignore
    setGraphXml(graphXml);

    setTimeout(async function () {
      AP.resize();
      try {
        await createAttachmentIfContentChanged(graphXml);
      } catch (e) {
        // Do not re-throw the error
        console.error('Error when creating attachment', e);
        trackEvent(JSON.stringify(e), 'create_attachment', 'error');
      }
    }, 1500);
  }
})()
