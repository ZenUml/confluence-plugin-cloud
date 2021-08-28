import Vue from 'vue'
import Vuex from 'vuex'

// @ts-ignore
import {Store} from 'vue-sequence'

import ApWrapper from "@/utils/ApWrapper";
import AP from "@/utils/AP";
import SequenceDiagramLoader from "@/utils/SequenceDiagramLoader";
Vue.use(Vuex)

async function getCode() {
  const confluenceWrapper = new ApWrapper(AP)
  let sequenceDiagramLoader = new SequenceDiagramLoader(confluenceWrapper);
  // @ts-ignore
  window.sequenceDiagramLoader = sequenceDiagramLoader
  let content = await sequenceDiagramLoader.load();
  return content.code || 'A.method';
}

async function configStoreAsyncFn() {
  let storeInstance = Store();
  const store = new Vuex.Store(storeInstance);
  store.commit('code', await getCode());
  return store;
}

export default configStoreAsyncFn