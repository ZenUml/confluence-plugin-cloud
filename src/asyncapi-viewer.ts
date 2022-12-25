import Vue from 'vue'
import Vuex from 'vuex'
import ExtendedStore from './model/Store'
import { trackEvent } from "@/utils/window";
import globals from '@/model/globals';
import createAttachmentIfContentChanged from "@/model/Attachment";
import AP from "@/model/AP";
import defaultContentProvider from "@/model/ContentProvider/CompositeContentProvider";
import ApWrapper2 from "@/model/ApWrapper2";
import AsyncApiViewer from "@/components/Viewer/AsyncApiViewer.vue";
import { encode } from 'js-base64';
import EventBus from './EventBus'

Vue.config.productionTip = false
Vue.use(Vuex)

const store = new Vuex.Store(ExtendedStore);
const render = (h: Function) => h(AsyncApiViewer);

if (document.getElementById('app')) {
  // @ts-ignore
  new Vue({ store, render }).$mount('#app');
}

function loadMainFrame(data: string) {
  const e = document.getElementById('mainFrame');
  if (e) {
    const base64 = encode(data);
    // @ts-ignore
    e.src = `asyncapi-viewer/index.html?base64=${base64}`;
  }
}

async function createAttachment(code?: string) {
  try {
    if (await globals.apWrapper.canUserEdit()) {
      await createAttachmentIfContentChanged(code);
    }
  } catch (e) {
    // Do not re-throw the error
    console.error('Error when creating attachment', e);
  }
}

async function initializeMacro() {
  try {
    const contentProvider = defaultContentProvider(new ApWrapper2(AP));
    const { doc } = await contentProvider.load();

    //@ts-ignore
    loadMainFrame(doc.code);

    setTimeout(async () => {
      await createAttachment(doc.code);
    }, 1500);

  } catch (e) {
    console.error('Error on initializing macro:', e);
    trackEvent(JSON.stringify(e), 'load_macro', 'error');
  }
}

initializeMacro();

EventBus.$on('edit', () => {
  // @ts-ignore
  AP.dialog.create(
    {
      key: 'zenuml-content-asyncapi-editor-dialog',
        chrome: false,
        width: "100%",
        height: "100%",
    }).on('close', initializeMacro);
});

EventBus.$on('fullscreen', () => {
  // @ts-ignore
  AP.dialog.create(
    {
      key: 'zenuml-content-asyncapi-viewer-dialog',
      chrome: true,
      width: "100%",
      height: "100%",
    });
});