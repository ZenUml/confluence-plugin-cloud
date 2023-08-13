import {createApp, h} from 'vue'
import {createStore} from 'vuex'
import './assets/tailwind.css'

import defaultContentProvider from "@/model/ContentProvider/CompositeContentProvider";
import AP from "@/model/AP";
import ApWrapper2 from "@/model/ApWrapper2";
import {Diagram, DiagramType} from "@/model/Diagram/Diagram";
import ExtendedStore from './model/Store'
import Viewer from "@/components/Viewer/Viewer.vue";

async function getDiagram(): Promise<Diagram> {
  const contentProvider = defaultContentProvider(new ApWrapper2(AP));
  let {doc} = await contentProvider.load();
  // Do not fall back to example. If it is empty show empty.
  return doc;
}

function mountDiagramFrame(diagram: Diagram, store: any, id: string) {
  console.log('sequence-viewer-dialog.ts - using app', document.getElementById(id))
  if (document.getElementById(id)) {
    console.log('sequence-viewer-dialog.ts - using component', Viewer)
    const app = createApp(Viewer);
    app.use(store);
    app.mount('#app');
  }
}

async function main() {
  const diagram = await getDiagram();
  const store = createStore(ExtendedStore);

  if(diagram.diagramType === DiagramType.Sequence) {
    store.commit('updateCode2', 'diagram.code');
  } else if (diagram.diagramType === DiagramType.Mermaid) {
    store.commit('updateDiagramType', diagram.diagramType);
    store.dispatch('updateMermaidCode', diagram.mermaidCode);
  }

  mountDiagramFrame(diagram, store, 'app');
}

// We do not have to export main(), but otherwise IDE shows a warning
export default main();
