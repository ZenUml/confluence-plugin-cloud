import Vue from 'vue'
import Vuex from 'vuex'

import MockApConfluence from './model/MockApConfluence'
import Workspace from './components/Workspace.vue'
import mermaid from 'mermaid'
// @ts-ignore
import Va from 'vue-atlas'

// ==== CSS ====
import 'vue-atlas/dist/vue-atlas.css'
import './assets/tailwind.css'
import 'vue-sequence/dist/vue-sequence.css'
// Code Editor style
import 'codemirror/lib/codemirror.css'
// theme css
import 'codemirror/theme/base16-dark.css'

import ExtendedStore from './model/Store'
import EventBus from './EventBus'
import {initializeMacro} from "@/model/macro/InitializeMacro";
import './GTagConfig'
import globals from '@/model/globals';

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
      render: h => h(Workspace) // with this method, we don't need to use full version of vew
    }).$mount('#app')
}
// @ts-ignore
window.store = store

if (window.location.href.includes('localhost')) {
  // eslint-disable-next-line
  console.log('You are using a mocked AP.confluence')
  // @ts-ignore
  window.AP = {
    confluence: new MockApConfluence()
  }
}

EventBus.$on('save', async () => {
  // @ts-ignore
  await globals.macro.save2(store.state.code, store.state.styles, store.state.mermaidCode, store.state.diagramType, store.getters.title);

  // @ts-ignore
  AP.dialog.close();
});

initializeMacro(store);