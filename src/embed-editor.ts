import Vue from 'vue'
import Vuex from 'vuex'

import DiagramList from './components/DiagramList.vue'
import mermaid from 'mermaid'
// @ts-ignore
import Va from 'vue-atlas'

// ==== CSS ====
import 'vue-atlas/dist/vue-atlas.css'
import './assets/tailwind.css'
import 'vue-sequence/dist/vue-sequence.css'

import ExtendedStore from './model/Store'
import EventBus from './EventBus'
import {initializeMacro} from "@/model/macro/InitializeMacro";
import './GTagConfig'
import globals from '@/model/globals';
import AP from "@/model/AP";

Vue.use(Va, 'en')

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
      render: h => h(DiagramList)
    }).$mount('#app')
}
// @ts-ignore
window.store = store

EventBus.$on('save', async () => {
  // eslint-disable-next-line
  // @ts-ignore
  console.log('picked: ', window.picked);

  // eslint-disable-next-line
  // @ts-ignore
  const diagram = JSON.parse(window.picked.body.raw.value);

  // eslint-disable-next-line
  // @ts-ignore
  await globals.macro.saveEmbedded(window.picked.id, window.picked.type, diagram);

  // @ts-ignore
  AP.dialog.close();
});

initializeMacro(store);