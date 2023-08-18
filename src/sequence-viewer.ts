import ApWrapper2 from "@/model/ApWrapper2";
import defaultContentProvider from "@/model/ContentProvider/CompositeContentProvider";
import globals from '@/model/globals';

import DiagramPortal from "@/components/DiagramPortal.vue";
import {mountRoot} from "@/mount-root";

import AP from "@/model/AP";
import EventBus from './EventBus'
import {trackEvent} from "@/utils/window";
import createAttachmentIfContentChanged from "@/model/Attachment";
import {DiagramType} from "@/model/Diagram/Diagram";

import '@zenuml/core/dist/style.css'
import './assets/tailwind.css'

async function main() {
  await globals.apWrapper.initializeContext();
  const compositeContentProvider = defaultContentProvider(globals.apWrapper as ApWrapper2);
  let {doc} = await compositeContentProvider.load();
  mountRoot(doc, DiagramPortal);
}

export default main()

EventBus.$on('diagramLoaded', () => {
  console.debug('Resize macro');
  // @ts-ignore
  setTimeout(window.AP?.resize, 1500)
});

async function createAttachment(code: string, diagramType: DiagramType) {
  try {
    if (globals.apWrapper.isDisplayMode() && await globals.apWrapper.canUserEdit()) {
      trackEvent(diagramType, 'before_create_attachment', 'info');
      await createAttachmentIfContentChanged(code);
    } else {
      trackEvent(diagramType, 'skip_create_attachment', 'info');
    }
  } catch (e) {
    // Do not re-throw the error
    console.error('Error when creating attachment', e);
    trackEvent(JSON.stringify(e), 'create_attachment' + diagramType, 'error');
  }
}

EventBus.$on('diagramLoaded', async (code: string, diagramType: DiagramType) => {
  setTimeout(async () => {
    await createAttachment(code, diagramType);
  }, 1500);
});

EventBus.$on('edit', () => {
  // @ts-ignore
  AP.dialog.create(
    {
      key: 'zenuml-content-sequence-editor-dialog',
        chrome: false,
        width: "100%",
        height: "100%",
    }).on('close', async () => {
      location.reload();
  });
});

EventBus.$on('fullscreen', () => {
  // @ts-ignore
  AP.dialog.create(
    {
      key: 'zenuml-content-sequence-viewer-dialog',
      chrome: true,
      width: "100%",
      height: "100%",
    });
});
