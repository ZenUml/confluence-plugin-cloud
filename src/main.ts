import { VueSequence } from '@zenuml/core';

import Workspace from './components/Workspace.vue'
import mermaid from 'mermaid'

import './assets/tailwind.css'
import '@zenuml/core/dist/style.css'

import ExtendedStore from './model/Store'

const Vue = VueSequence.Vue;
const Vuex = VueSequence.Vuex;

// @ts-ignore
window.mermaid = mermaid;

mermaid.mermaidAPI.initialize({
  startOnLoad:true
})

Vue.config.productionTip = false

Vue.use(Vuex)

const store = new Vuex.Store(ExtendedStore);
if(document.getElementById('app')) {
  new Vue({
      store,
      render: (h: any) => h(Workspace) // with this method, we don't need to use full version of vew
    }).$mount('#app')
}
