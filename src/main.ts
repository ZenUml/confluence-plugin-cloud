import { createApp } from 'vue'
import { createStore } from 'vuex'
import Workspace from './components/Workspace.vue'
import mermaid from 'mermaid'
import './assets/tailwind.css'
import ExtendedStore from './model/Store'
import defaultContentProvider from "@/model/ContentProvider/CompositeContentProvider";
import ApWrapper2 from "@/model/ApWrapper2";
import AP from "@/model/AP";
import {DiagramType, NULL_DIAGRAM} from "@/model/Diagram/Diagram";
import Example from "@/utils/sequence/Example";
import globals from "@/model/globals";

// @ts-ignore
window.mermaid = mermaid;

mermaid.mermaidAPI.initialize({
  startOnLoad:true
})

function mountDiagramFrame(store: any, id: string) {
  if (document.getElementById(id)) {
    const app = createApp(Workspace);
    app.use(store);
    app.mount('#app');
  }
}

async function main() {
  const compositeContentProvider = defaultContentProvider(new ApWrapper2(AP));
  let {doc} = await compositeContentProvider.load();

  if (doc === NULL_DIAGRAM) {
    doc = {
      diagramType: DiagramType.Sequence,
      code: Example.Sequence
    }
  }
  const store = createStore(ExtendedStore);
  store.state.diagram = doc;
  await globals.apWrapper.initializeContext();

  mountDiagramFrame(store, 'app');
}

// We do not have to export main(), but otherwise IDE shows a warning
export default main();
