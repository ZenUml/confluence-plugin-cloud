import Vue from 'vue'
import Vuex from 'vuex'

import {VueSequence} from 'vue-sequence'

import ApWrapper2 from "./ApWrapper2";
import AP from "@/model/AP";
import SequenceDiagramLoader from "@/model/SequenceDiagramLoader";
Vue.use(Vuex)

async function getCode() {
  // @ts-ignore
  const apWrapper = new ApWrapper2(AP);
  await apWrapper.initializeContext();
  
  let sequenceDiagramLoader = new SequenceDiagramLoader(apWrapper);
  // @ts-ignore
  window.sequenceDiagramLoader = sequenceDiagramLoader
  let content = await sequenceDiagramLoader.load();
  return content.code || 'A.method';
}

async function configStoreAsyncFn() {
  let storeInstance = VueSequence.Store();
  const store = new Vuex.Store(storeInstance);
  store.commit('code', await getCode());
  return store;
}

export default configStoreAsyncFn