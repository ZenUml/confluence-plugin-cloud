import Vue from 'vue'
import Vuex from 'vuex'

import Workspace from './components/Workspace.vue'
import mermaid from 'mermaid'

// ==== CSS ====
import './assets/tailwind.css'
import 'vue-sequence/dist/vue-sequence.css'

import ExtendedStore from './model/Store'
import EventBus from './EventBus'
import {initializeMacro} from "@/model/macro/InitializeMacro";
import globals from '@/model/globals';
import AP from "@/model/AP";

// eslint-disable-next-line
// @ts-ignore
window.mermaid = mermaid

mermaid.mermaidAPI.initialize({
  startOnLoad:true
})

Vue.config.productionTip = false

Vue.use(Vuex)

const store = new Vuex.Store(ExtendedStore);
if(document.getElementById('app')) {
    new Vue({
      store,
      render: h => h(Workspace) // with this method, we don't need to use full version of vew
    }).$mount('#app')
}
// @ts-ignore
window.store = store

EventBus.$on('save', async () => {
  // @ts-ignore
  await globals.macro.save2(store.state.code, store.state.styles, store.state.mermaidCode, store.state.diagramType, store.getters.title);

  // @ts-ignore
  AP.dialog.close();
});

initializeMacro(store);