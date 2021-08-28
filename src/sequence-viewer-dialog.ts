import Vue from 'vue'
import Vuex from 'vuex'

import './assets/tailwind.css'
// @ts-ignore
import { Version, SeqDiagram, DiagramFrame, Store } from 'vue-sequence'
import 'vue-sequence/dist/vue-sequence.css'

// @ts-ignore
import Va from 'vue-atlas'
import 'vue-atlas/dist/vue-atlas.css'
import AP from './utils/AP'
import SequenceDiagramLoader from './utils/SequenceDiagramLoader'
import ConfluenceWrapper from "@/utils/ConfluenceWrapper";

Vue.use(Vuex)
Vue.use(Va)

console.log('From sequence viewer dialog');
const confluenceWrapper = new ConfluenceWrapper(AP)
let sequenceDiagramLoader = new SequenceDiagramLoader(confluenceWrapper);
let code = 'A.method1';
// @ts-ignore
window.sequenceDiagramLoader = sequenceDiagramLoader
async function main() {
  let content = await sequenceDiagramLoader.load();
  code = content.code || 'B.method2';
  let storeInstance = Store();
  const store = new Vuex.Store(storeInstance);
  store.commit('code', code);
  if(document.getElementById('app')) {
    new Vue({
      store,
      render: h => h(DiagramFrame) // with this method, we don't need to use full version of vew
    }).$mount('#app')
  }
}

main();
