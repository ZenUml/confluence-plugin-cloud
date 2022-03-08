import Vue from 'vue'
import Vuex from 'vuex'
import { VueSequence } from 'vue-sequence'
import 'vue-sequence/dist/vue-sequence.css'
import './assets/tailwind.css'
console.log(`vue-sequence version: ${VueSequence.Version}`)

import './model/MockApConfluence'
import mermaid from 'mermaid'

import ExtendedStore from './model/Store'
import EventBus from './EventBus'
import Viewer from "@/components/Viewer.vue";
import {trackEvent} from "@/utils/window";
import {initializeMacro} from "@/model/macro/InitializeMacro";
import './GTagConfig'

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

EventBus.$on('diagramLoaded', () => {
  console.debug('Resize macro');
  // @ts-ignore
  setTimeout(window.AP?.resize, 500)
});
EventBus.$on('diagramLoaded', async () => {
  // @ts-ignore
  const macro = window.macro;
  if(!macro?._standaloneCustomContent) {

    const canEdit = await macro.canEditOnDialog();
    store.dispatch('updateCanEdit', canEdit);

    try {
      // @ts-ignore
      await window.createAttachmentIfContentChanged(macro?._diagram?.code);
    } catch (e) {
      // Do not re-throw the error
      console.error('Error when creating attachment', e);
      trackEvent(JSON.stringify(e), 'create_attachment', 'error');
    }
  }
});

EventBus.$on('edit', () => {
  // @ts-ignore
  AP.dialog.create(
    {
      key: 'zenuml-content-sequence-editor-dialog',
        chrome: false,
        width: "100%",
        height: "100%",
    }).on('close', () => initializeMacro(store));
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

initializeMacro(store);