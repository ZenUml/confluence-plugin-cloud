import Vue from 'vue'
import './assets/tailwind.css'
import {VueSequence} from 'vue-sequence'
import 'vue-sequence/dist/vue-sequence.css'

import Vuex from 'vuex'
import defaultContentProvider from "@/model/ContentProvider/CompositeContentProvider";
import AP from "@/model/AP";
import ApWrapper2 from "@/model/ApWrapper2";
import {Diagram, DiagramType} from "@/model/Diagram/Diagram";
import MermaidViewer from '@/components/Viewer/MermaidViewer.vue';
import ExtendedStore from './model/Store'

Vue.use(Vuex)

async function getDiagram(): Promise<Diagram> {
  const contentProvider = defaultContentProvider(new ApWrapper2(AP));
  let {doc} = await contentProvider.load();
  // Do not fall back to example. If it is empty show empty.
  return doc;
}

console.debug('From sequence viewer dialog');

function mountDiagramFrame(diagram: Diagram, store: any, id: string) {
  if (document.getElementById(id)) {
    const component = diagram.diagramType === DiagramType.Sequence ? VueSequence.DiagramFrame : MermaidViewer;
    const render = (h: Function) => h(component)
    new Vue({
      store,
      render // with this method, we don't need to use full version of vew
    }).$mount(`#${id}`)
  }
}

async function main() {
  const diagram = await getDiagram();
  const store = new Vuex.Store(ExtendedStore);
  mountDiagramFrame(diagram, store, 'app');

  if(diagram.diagramType === DiagramType.Sequence) {
    store.commit('code', diagram.code);
  }
  else if (diagram.diagramType === DiagramType.Mermaid) {
    store.commit('updateDiagramType', diagram.diagramType);
    store.dispatch('updateMermaidCode', diagram.mermaidCode);
  }
}

// We do not have to export main(), but otherwise IDE shows a warning
export default main();
