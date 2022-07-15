import Vue from 'vue'
import Vuex from 'vuex'
// @ts-ignore
import VueCodeMirror from 'vue-codemirror'

import './assets/tailwind.css'
import {VueSequence} from 'vue-sequence'
import 'vue-sequence/dist/vue-sequence.css'
console.log(VueSequence.Version)

import MockApConfluence from './model/MockApConfluence'
import Editor from './components/Editor.vue'
import Workspace from './components/Workspace.vue'
import mermaid from 'mermaid'

// @ts-ignore
import Va from 'vue-atlas'
import 'vue-atlas/dist/vue-atlas.css'

// Code Editor style
import 'codemirror/lib/codemirror.css'
// theme css
import 'codemirror/theme/base16-dark.css'
import ExtendedStore from './model/Store'
import EventBus from './EventBus'
import {initializeMacro} from "@/model/macro/InitializeMacro";
import './GTagConfig'

Vue.use(Va, 'en')

// eslint-disable-next-line
// @ts-ignore
window.mermaid = mermaid

mermaid.mermaidAPI.initialize({
  startOnLoad:true
})

Vue.config.productionTip = false

Vue.component('diagram-frame', VueSequence.DiagramFrame)
Vue.component('editor', Editor)
Vue.component('workspace', Workspace)
Vue.use(VueCodeMirror)

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
  await store.state.macro.save2(store.state.code, store.state.styles, store.state.mermaidCode, store.state.diagramType, store.getters.title);

  // @ts-ignore
  AP.dialog.close();
});

initializeMacro(store);