import AP from "@/model/AP";
import createAttachmentIfContentChanged from "@/model/Attachment";
import {trackEvent} from "@/utils/window";
import './assets/tailwind.css'
import globals from '@/model/globals';
import {decompress} from '@/utils/compress';
import defaultContentProvider from "@/model/ContentProvider/CompositeContentProvider";
import ApWrapper2 from "@/model/ApWrapper2";
import GraphViewer from "@/components/Viewer/GraphViewer.vue";
import EventBus from './EventBus'
import {DiagramType} from "@/model/Diagram/Diagram";
import {mountRoot} from "@/mount-root";

EventBus.$on('diagramLoaded', () => {
  console.debug('Resize macro');
  // @ts-ignore
  setTimeout(window.AP?.resize, 1500)
});

function renderGraph(graphXml: string) {
  const element = document.getElementById('graph');
  if(element && element.innerHTML.trim()) {
    element.innerHTML = '';
  }

  //@ts-ignore
  const graph = new Graph(element);
  graph.resizeContainer = true;
  graph.setEnabled(false);

  // setGraphStyle is only available on viewer and maybe should only be used on viewer.
  // @ts-ignore
  setGraphStyle && setGraphStyle('styles/default.xml', graph);
  // @ts-ignore
  setGraphXml(graphXml, graph);

  setTimeout(async function () {
    AP.resize();
    try {
      if (globals.apWrapper.isDisplayMode() && await globals.apWrapper.canUserEdit()) {
        await createAttachmentIfContentChanged(graphXml);
      } else {
        trackEvent(DiagramType.Graph, 'skip_create_attachment', 'warning');
      }
    } catch (e) {
      // Do not re-throw the error
      console.error('Error when creating attachment', e);
      trackEvent(JSON.stringify(e), 'create_attachment', 'error');
    }
  }, 1500);
}

async function loadDiagram() {
  const compositeContentProvider = defaultContentProvider(new ApWrapper2(AP));
  const {doc} = await compositeContentProvider.load();
  mountRoot(doc, GraphViewer);
  let graphXml = doc.graphXml;
  if (doc?.compressed) {
    trackEvent('compressed_field_viewer', 'load', 'warning');
    if (!graphXml?.startsWith('<mxGraphModel')) {
      graphXml = decompress(doc.graphXml);
      trackEvent('compressed_content_viewer', 'load', 'warning');
    }
  }
  console.debug('doc', doc);
  if(graphXml) {
    renderGraph(graphXml);
  }
}

(async function initializeMacro() {
  console.log('Initializing macro');
  const apWrapper = globals.apWrapper;
  await apWrapper.initializeContext();

  await loadDiagram();
})()

EventBus.$on('edit', () => {
  // @ts-ignore
  AP.dialog.create(
    {
      key: 'zenuml-content-graph-editor-dialog',
        chrome: false,
        width: "100%",
        height: "100%",
    }).on('close', loadDiagram);
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
