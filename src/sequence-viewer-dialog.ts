import Vue from 'vue'
import Vuex from 'vuex'

import './assets/tailwind.css'
// @ts-ignore
import {DiagramFrame, Store} from 'vue-sequence'
import 'vue-sequence/dist/vue-sequence.css'

import AP from './utils/AP'
import SequenceDiagramLoader from './utils/SequenceDiagramLoader'
import ConfluenceWrapper from "@/utils/ConfluenceWrapper";

Vue.use(Vuex)

console.log('From sequence viewer dialog');

async function getCode() {
  const confluenceWrapper = new ConfluenceWrapper(AP)
  let sequenceDiagramLoader = new SequenceDiagramLoader(confluenceWrapper);
  // @ts-ignore
  window.sequenceDiagramLoader = sequenceDiagramLoader
  let content = await sequenceDiagramLoader.load();
  return content.code || 'A.method';
}

function configStore(code: string) {
  let storeInstance = Store();
  const store = new Vuex.Store(storeInstance);
  store.commit('code', code);
  return store;
}

function mountDiagramFrame(store: any) {
  if (document.getElementById('app')) {
    new Vue({
      store,
      render: h => h(DiagramFrame) // with this method, we don't need to use full version of vew
    }).$mount('#app')
  }
}

async function main() {
  let code = await getCode();
  const store = configStore(code);
  mountDiagramFrame(store);
}

main();
