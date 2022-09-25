import Vue from 'vue'
import Vuex from 'vuex'
import {VueSequence} from 'vue-sequence'
import defaultContentProvider from "@/model/ContentProvider/CompositeContentProvider";
import AP from "@/model/AP";
import ApWrapper2 from "@/model/ApWrapper2";

Vue.use(Vuex)

async function getCode() {
  const contentProvider = defaultContentProvider(new ApWrapper2(AP));
  let {doc} = await contentProvider.load();
  // Do not fall back to example. If it is empty show empty.
  return doc.code;
}

async function configStoreAsyncFn() {
  let storeInstance = VueSequence.Store();
  const store = new Vuex.Store(storeInstance);
  store.commit('code', await getCode());
  return store;
}

export default configStoreAsyncFn