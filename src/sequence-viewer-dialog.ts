import Vue from 'vue'
import './assets/tailwind.css'
// @ts-ignore
import {DiagramFrame} from 'vue-sequence'
import 'vue-sequence/dist/vue-sequence.css'

import configStoreAsyncFn from "./model/sequence-view-store";
console.log('From sequence viewer dialog');

function mountDiagramFrame(store: any, id: string) {
  if (document.getElementById(id)) {
    new Vue({
      store,
      render: h => h(DiagramFrame) // with this method, we don't need to use full version of vew
    }).$mount(`#${id}`)
  }
}

async function main() {
  mountDiagramFrame(await configStoreAsyncFn(), 'app');
}

// We do not have to export main(), but otherwise IDE shows a warning
export default main();
