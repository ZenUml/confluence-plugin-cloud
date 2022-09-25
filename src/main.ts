import Vue from 'vue'
import Vuex from 'vuex'

import Workspace from './components/Workspace.vue'
import mermaid from 'mermaid'

// @ts-ignore
import './assets/tailwind.css'
import 'vue-sequence/dist/vue-sequence.css'

import ExtendedStore from './model/Store'

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
