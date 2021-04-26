import Vue from 'vue'
import Vuex from 'vuex'
// @ts-ignore
import { Version, SeqDiagram } from 'vue-sequence'
import 'vue-sequence/dist/vue-sequence.css'
// eslint-disable-next-line
console.log(Version)

import './utils/MockApConfluence'
import Macro from './utils/Macro'
import mermaid from 'mermaid'

import ExtendedStore from './Store'
import Viewer from "@/components/Viewer.vue";

// eslint-disable-next-line
// @ts-ignore
window.mermaid = mermaid

mermaid.mermaidAPI.initialize({
  startOnLoad:true
})

Vue.config.productionTip = false
Vue.component('seq-diagram', SeqDiagram)
Vue.use(Vuex)

const store = new Vuex.Store(ExtendedStore);
if(document.getElementById('app')) {
    new Vue({
      store,
      render: h => h(Viewer) // with this method, we don't need to use full version of vew
    }).$mount('#app')
}
// @ts-ignore
window.store = store

async function initializeMacro() {
  console.debug('Initializing macro from sequence-viewer.ts');
// @ts-ignore
  const macro = store.state.macro || new Macro(AP);
  // @ts-ignore
  window.macro = macro;
  const {code, styles, mermaidCode, diagramType} = await macro.load();

  store.commit('code', code);
  // @ts-ignore
  store.state.styles = styles;
  // @ts-ignore
  store.dispatch('updateMermaidCode', mermaidCode || store.state.mermaidCode)
  store.dispatch('updateDiagramType', diagramType)
  // @ts-ignore
  await window.createAttachmentIfContentChanged(code);
  let timing = window.performance.timing;
  console.debug('ZenUML diagram loading time:%s (ms)', timing.domContentLoadedEventEnd- timing.navigationStart)
}

initializeMacro();