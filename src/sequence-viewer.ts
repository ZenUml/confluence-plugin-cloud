import Vue from 'vue'
import Vuex from 'vuex'
// @ts-ignore
import { Version, SeqDiagram } from 'vue-sequence'
import 'vue-sequence/dist/vue-sequence.css'
import './assets/tailwind.css'
// eslint-disable-next-line
console.log(`vue-sequence version: ${Version}`)

import './utils/model/MockApConfluence'
import Macro from './utils/model/Macro'
import mermaid from 'mermaid'

import ExtendedStore from './Store'
import EventBus from './EventBus'
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