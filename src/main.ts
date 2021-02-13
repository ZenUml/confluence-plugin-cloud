import Vue from 'vue'
import Vuex from 'vuex'
// @ts-ignore
import VueCodeMirror from 'vue-codemirror'

// @ts-ignore
import { Version, SeqDiagram } from 'vue-sequence'
import 'vue-sequence/dist/vue-sequence.css'
// eslint-disable-next-line
console.log(Version)

import MockApConfluence from './utils/MockApConfluence'
import Macro from './utils/Macro'
// @ts-ignore
import Editor from './components/Editor'
// @ts-ignore
import Workspace from './components/Workspace'
import mermaid from 'mermaid'

// @ts-ignore
import Va from 'vue-atlas'
import 'vue-atlas/dist/vue-atlas.css'

// Code Editor style
import 'codemirror/lib/codemirror.css'
// theme css
import 'codemirror/theme/base16-dark.css'
import ExtendedStore from './Store'

Vue.use(Va, 'en')

// eslint-disable-next-line
// @ts-ignore
window.mermaid = mermaid

mermaid.mermaidAPI.initialize({
  startOnLoad:true
})

Vue.config.productionTip = false

Vue.component('seq-diagram', SeqDiagram)
Vue.component('editor', Editor)
Vue.component('workspace', Workspace)
Vue.use(VueCodeMirror)

Vue.use(Vuex)

const store = new Vuex.Store(ExtendedStore);

new Vue({
  store,
  render: h => h(Workspace) // with this method, we don't need to use full version of vew
}).$mount('#app')
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

// @ts-ignore
window.Macro = Macro
// @ts-ignore
if(window.onAppLoaded) {
  // @ts-ignore
    window.onAppLoaded();
}