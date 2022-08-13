import Vue from 'vue'
import Vuex from 'vuex'
import {VueSequence} from 'vue-sequence'
import defaultContentProvider from "@/model/ContentProvider/CompositeContentProvider";
import AP from "@/model/AP";

Vue.use(Vuex)

async function getCode() {
  const contentProvider = defaultContentProvider(AP);
  let {doc} = await contentProvider.load();
  return doc.code || 'A.method';
}

async function configStoreAsyncFn() {
  let storeInstance = VueSequence.Store();
  const store = new Vuex.Store(storeInstance);
  store.commit('code', await getCode());
  return store;
}

export default configStoreAsyncFn