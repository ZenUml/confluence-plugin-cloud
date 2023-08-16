import GraphViewer from "@/components/Viewer/GraphViewer.vue";
import defaultContentProvider from "@/model/ContentProvider/CompositeContentProvider";
import globals from '@/model/globals';
import {mountApp} from "@/mount-app";
import './assets/tailwind.css'

import AP from "@/model/AP";
import EventBus from './EventBus'
// import {DiagramType} from "@/model/Diagram/Diagram";
// import {trackEvent} from "@/utils/window";
// import createAttachmentIfContentChanged from "@/model/Attachment";

async function main() {
  const compositeContentProvider = defaultContentProvider(globals.apWrapper);
  let {doc} = await compositeContentProvider.load();
  await globals.apWrapper.initializeContext();
  mountApp(GraphViewer, doc);
  // @ts-ignore
  setTimeout(window.AP?.resize, 1500)
}

export default main();

EventBus.$on('diagramLoaded', () => {
  setTimeout(async () => {
    AP.resize();
    // try {
    //   if (globals.apWrapper.isDisplayMode() && await globals.apWrapper.canUserEdit()) {
    //     trackEvent(DiagramType.Graph, 'before_create_attachment', 'info');
    //     await createAttachmentIfContentChanged(graphXml);
    //   } else {
    //     trackEvent(DiagramType.Graph, 'skip_create_attachment', 'warning');
    //   }
    // } catch (e) {
    //   // Do not re-throw the error
    //   console.error('Error when creating attachment', e);
    //   trackEvent(JSON.stringify(e), 'create_attachment', 'error');
    // }
  }, 1500);

});


EventBus.$on('edit', () => {
  // @ts-ignore
  AP.dialog.create(
    {
      key: 'zenuml-content-graph-editor-dialog',
      chrome: false,
      width: "100%",
      height: "100%",
    }).on('close', () => {
    // @ts-ignore
    location.reload();
  });
});

EventBus.$on('fullscreen', () => {
  // @ts-ignore
  AP.dialog.create(
    {
      key: 'zenuml-content-graph-viewer-dialog',
      chrome: true,
      width: "100%",
      height: "100%",
    });
});
