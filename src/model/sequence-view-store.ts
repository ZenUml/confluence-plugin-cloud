import Vue from 'vue'
import Vuex from 'vuex'
import {VueSequence} from 'vue-sequence'
import SequenceDiagramLoader from "@/model/SequenceDiagramLoader";
import globals from '@/model/globals';

Vue.use(Vuex)

async function getCode() {
  // @ts-ignore
  const apWrapper = globals.apWrapper;
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