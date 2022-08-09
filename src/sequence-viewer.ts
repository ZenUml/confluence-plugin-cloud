import Vue from 'vue'
import Vuex from 'vuex'
import 'vue-sequence/dist/vue-sequence.css'
import './assets/tailwind.css'

import './model/MockApConfluence'
import mermaid from 'mermaid'

import ExtendedStore from './model/Store'
import EventBus from './EventBus'
import Viewer from "@/components/Viewer.vue";
import {trackEvent} from "@/utils/window";
import {initializeMacro} from "@/model/macro/InitializeMacro";
import createAttachmentIfContentChanged from "@/model/Attachment";
import './GTagConfig'
import globals from '@/model/globals';
import BaseMacro2 from "@/model/BaseMacro2";

// eslint-disable-next-line
// @ts-ignore
window.mermaid = mermaid

mermaid.mermaidAPI.initialize({
  startOnLoad:true
})

Vue.config.productionTip = false
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
  setTimeout(window.AP?.resize, 1500)
});

async function createAttachment(macro: BaseMacro2) {
  let diagramType = macro._diagram?.diagramType || 'unknown';
  try {
    if (await globals.apWrapper.canUserEdit()) {
      trackEvent(diagramType, 'before_create_attachment', 'info');
      await createAttachmentIfContentChanged(store.getters.content);
    } else {
      trackEvent(diagramType, 'skip_create_attachment', 'info');
    }
  } catch (e) {
    // Do not re-throw the error
    console.error('Error when creating attachment', e);
    trackEvent(JSON.stringify(e), 'create_attachment' + diagramType, 'error');
  }
}

EventBus.$on('diagramLoaded', async () => {
  // @ts-ignore
  const macro = globals.macro;
  if(!macro?._standaloneCustomContent) {

    const canEdit = await macro.canEditOnDialog();
    store.dispatch('updateCanEdit', canEdit);
    setTimeout(async () => {
      await createAttachment(macro);
    }, 1500);
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
