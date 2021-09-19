import Vue from 'vue'
import Vuex from 'vuex'
import { VueSequence } from 'vue-sequence'
import 'vue-sequence/dist/vue-sequence.css'
import './assets/tailwind.css'
console.log(`vue-sequence version: ${VueSequence.Version}`)

import './model/MockApConfluence'
import Macro from './model/Macro'
import mermaid from 'mermaid'

import ExtendedStore from './model/Store'
import EventBus from './EventBus'
import Viewer from "@/components/Viewer.vue";

// eslint-disable-next-line
// @ts-ignore
window.mermaid = mermaid

mermaid.mermaidAPI.initialize({
  startOnLoad:true
})

Vue.config.productionTip = false
Vue.component('seq-diagram', VueSequence.SeqDiagram)
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
  // @ts-ignore
  console.debug('Initializing macro from sequence-viewer.ts', store.state.macro);
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

  if(!macro._standaloneCustomContent) {
    // @ts-ignore
    await window.createAttachmentIfContentChanged(code);
  }
  let timing = window.performance.timing;
  console.debug('ZenUML diagram loading time:%s (ms)', timing.domContentLoadedEventEnd- timing.navigationStart)
}

EventBus.$on('edit', () => {
  // @ts-ignore
  AP.dialog.create(
    {
      key: 'zenuml-content-sequence-editor',
        chrome: false,
        width: "100%",
        height: "100%",
    }).on('close', initializeMacro);
});

EventBus.$on('fullscreen', () => {
  // @ts-ignore
  AP.dialog.create(
    {
      key: 'zenuml-content-sequence-viewer-dialog',
      chrome: true,
      width: "100%",
      height: "100%",
    });
});

initializeMacro();