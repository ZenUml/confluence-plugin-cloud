import Vue from 'vue'
import './assets/tailwind.css'
import {VueSequence} from 'vue-sequence'
import 'vue-sequence/dist/vue-sequence.css'

import configStoreAsyncFn from "./model/sequence-view-store";
console.log('From sequence viewer dialog');

function mountDiagramFrame(store: any, id: string) {
  if (document.getElementById(id)) {
    let component = VueSequence.DiagramFrame;
    const render = (h: Function) => h(component)
    new Vue({
      store,
      render // with this method, we don't need to use full version of vew
    }).$mount(`#${id}`)
  }
}

async function main() {
  mountDiagramFrame(await configStoreAsyncFn(), 'app');
}

// We do not have to export main(), but otherwise IDE shows a warning
export default main();
