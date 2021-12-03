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

let render = (h: Function) => h(Viewer);

if(document.getElementById('app')) {
    // @ts-ignore
  new Vue({
      store,
      render // with this method, we don't need to use full version of vue
    }).$mount('#app')
}
// @ts-ignore
window.store = store

async function initializeMacro() {
  // @ts-ignore
  console.debug('Initializing macro from sequence-viewer.ts', store.state.macro);
  // @ts-ignore
  const macro = window.macro || store.state.macro;
  // @ts-ignore
  window.macro = macro;
  try {
    const diagram = await macro.load();
    store.commit('code', diagram.code);
    // @ts-ignore
    store.state.styles = diagram.styles;
    // @ts-ignore
    store.state.macro = Object.assign({}, macro);
    // @ts-ignore
    store.dispatch('updateMermaidCode', diagram.mermaidCode || store.state.mermaidCode)
    store.dispatch('updateDiagramType', diagram.diagramType)

    const canEdit = await macro.canEditOnDialog();
    store.dispatch('updateCanEdit', canEdit);

    if(!macro._standaloneCustomContent) {
      try {
        // @ts-ignore
        await window.createAttachmentIfContentChanged(diagram.code);
      } catch (e) {
        // Do not re-throw the error
        console.debug('Error when creating attachment', e);
      }
    }
  } catch (e) {
    // @ts-ignore
    console.log('Error on initializing macro:', e);
    // @ts-ignore
    store.state.error = e;
  }

  let timing = window.performance.timing;
  console.debug('ZenUML diagram loading time:%s (ms)', timing.domContentLoadedEventEnd- timing.navigationStart)
}

EventBus.$on('edit', () => {
  // @ts-ignore
  AP.dialog.create(
    {
      key: 'zenuml-content-sequence-editor-dialog',
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