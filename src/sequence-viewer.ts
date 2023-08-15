import './assets/tailwind.css'
import Viewer from "@/components/Viewer/Viewer.vue";
import defaultContentProvider from "@/model/ContentProvider/CompositeContentProvider";
import AP from "@/model/AP";
import {DiagramType, NULL_DIAGRAM} from "@/model/Diagram/Diagram";
import globals from '@/model/globals';
import defaultSequenceDiagram from "@/default-sequence-diagram";
import {mountApp} from "@/mount-app";
import EventBus from './EventBus'
import {trackEvent} from "@/utils/window";
import createAttachmentIfContentChanged from "@/model/Attachment";

async function main() {
  const compositeContentProvider = defaultContentProvider(globals.apWrapper);
  let {doc} = await compositeContentProvider.load();

  if (doc === NULL_DIAGRAM) {
    doc = defaultSequenceDiagram
  }
  await globals.apWrapper.initializeContext();

  mountApp(Viewer, doc);
}

export default main();

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
    // @ts-ignore
    // location.reload();

    const compositeContentProvider = defaultContentProvider(globals.apWrapper);
    const {doc} = await compositeContentProvider.load();
    const diagramType = doc.diagramType;
    console.log('Re-loaded document after editing', doc, diagramType);
    // @ts-ignore
    window.doc = doc;
    // @ts-ignore
    store.state.diagram = doc;
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
EventBus.$on('reload', () => {
  // @ts-ignore
  location.reload();
});
