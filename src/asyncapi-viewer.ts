import Vue from 'vue'
import Vuex from 'vuex'
import ExtendedStore from './model/Store'
import { trackEvent } from "@/utils/window";
import AP from "@/model/AP";
import defaultContentProvider from "@/model/ContentProvider/CompositeContentProvider";
import ApWrapper2 from "@/model/ApWrapper2";
import AsyncApiViewer from "@/components/Viewer/AsyncApiViewer.vue";
import { encode } from 'js-base64';

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

async function initializeMacro() {
  try {
    const contentProvider = defaultContentProvider(new ApWrapper2(AP));
    const { doc } = await contentProvider.load();

    //@ts-ignore
    loadMainFrame(doc.code);

  } catch (e) {
    console.error('Error on initializing macro:', e);
    trackEvent(JSON.stringify(e), 'load_macro', 'error');
  }
}

initializeMacro();