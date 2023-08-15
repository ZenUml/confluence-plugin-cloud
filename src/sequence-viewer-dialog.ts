import {createApp} from 'vue'
import {createStore} from 'vuex'
import './assets/tailwind.css'

import defaultContentProvider from "@/model/ContentProvider/CompositeContentProvider";
import AP from "@/model/AP";
import ApWrapper2 from "@/model/ApWrapper2";
import {Diagram, DiagramType, NULL_DIAGRAM} from "@/model/Diagram/Diagram";
import ExtendedStore from './model/Store'
import Viewer from "@/components/Viewer/Viewer.vue";
import Example from "@/utils/sequence/Example";
import globals from "@/model/globals";

async function getDiagram(): Promise<Diagram> {
  const contentProvider = defaultContentProvider(new ApWrapper2(AP));
  let {doc} = await contentProvider.load();
  // Do not fall back to example. If it is empty show empty.
  return doc;
}

function mountDiagramFrame(store: any, id: string) {
  console.log('sequence-viewer-dialog.ts - using app', document.getElementById(id))
  if (document.getElementById(id)) {
    console.log('sequence-viewer-dialog.ts - using component', Viewer)
    const app = createApp(Viewer);
    app.use(store);
    app.mount('#app');
  }
}

async function main() {
  const compositeContentProvider = defaultContentProvider(new ApWrapper2(AP));
  let {doc} = await compositeContentProvider.load();
  console.debug('Editor - Document loaded:', doc);
  console.debug('Editor - Document is NULL_DIAGRAM?', doc === NULL_DIAGRAM);

  if (doc === NULL_DIAGRAM) {
    console.debug('Editor - Use default doc');

    doc = {
      diagramType: DiagramType.Sequence,
      code: Example.Sequence
    }
  }
  const store = createStore(ExtendedStore);
  store.state.diagram = doc;
  await globals.apWrapper.initializeContext();

  // if(diagram.diagramType === DiagramType.Sequence) {
  //   store.commit('updateCode2', 'diagram.code');
  // } else if (diagram.diagramType === DiagramType.Mermaid) {
  //   store.commit('updateDiagramType', diagram.diagramType);
  //   store.dispatch('updateMermaidCode', diagram.mermaidCode);
  // }

  mountDiagramFrame(store, 'app');
}

// We do not have to export main(), but otherwise IDE shows a warning
export default main();
