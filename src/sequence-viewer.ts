import Vue from 'vue'
import Vuex from 'vuex'
import 'vue-sequence/dist/vue-sequence.css'
import './assets/tailwind.css'

import './model/MockApConfluence'
import ExtendedStore from './model/Store'
import EventBus from './EventBus'
import Viewer from "@/components/Viewer/Viewer.vue";
import {trackEvent} from "@/utils/window";
import createAttachmentIfContentChanged from "@/model/Attachment";
import globals from '@/model/globals';
import {DiagramType} from "@/model/Diagram/Diagram";
import defaultContentProvider from "@/model/ContentProvider/CompositeContentProvider";
import ApWrapper2 from "@/model/ApWrapper2";
import AP from "@/model/AP";

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

async function createAttachment(code: string, diagramType: DiagramType) {
  try {
    if (await globals.apWrapper.canUserEdit()) {
      trackEvent(diagramType, 'before_create_attachment', 'info');
      await createAttachmentIfContentChanged(code);
    } else {
      trackEvent(diagramType, 'skip_create_attachment', 'info');
    }
  } catch (e) {
    // Do not re-throw the error
    console.error('Error when creating attachment', e);
    trackEvent(JSON.stringify(e), 'create_attachment' + diagramType, 'error');
  }
}

EventBus.$on('diagramLoaded', async (code: string, diagramType: DiagramType) => {
  setTimeout(async () => {
    await createAttachment(code, diagramType);
  }, 1500);
});

EventBus.$on('edit', () => {
  // @ts-ignore
  AP.dialog.create(
    {
      key: 'zenuml-content-sequence-editor-dialog',
        chrome: false,
        width: "100%",
        height: "100%",
    }).on('close', async () => {
    const compositeContentProvider = defaultContentProvider(new ApWrapper2(AP));
    const {doc} = await compositeContentProvider.load();
    // @ts-ignore
    store.state.diagram = doc;
  });
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
