import Vue from 'vue'
import Vuex from 'vuex'
import ExtendedStore from './model/Store'
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
import { Diagram } from './model/Diagram/Diagram';

Vue.config.productionTip = false
Vue.use(Vuex)

const store = new Vuex.Store(ExtendedStore);
let render = (h: Function) => h(GraphViewer);

if(document.getElementById('app')) {
  // @ts-ignore
  new Vue({
    store,
    render // with this method, we don't need to use full version of vue
  }).$mount('#app')
}

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
      await createAttachmentIfContentChanged(graphXml);
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
  let graphXml = doc.graphXml;
  if (doc?.compressed) {
    graphXml = decompress(doc.graphXml);
  }
  console.debug('graphXml', graphXml);
  if(graphXml) {
    renderGraph(graphXml);
  }
}

(async function initializeMacro() {
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
