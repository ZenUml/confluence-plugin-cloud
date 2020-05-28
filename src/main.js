import Vue from 'vue'
import Vuex from 'vuex'
import VueCodeMirror from 'vue-codemirror'

import { Version, SeqDiagram, Store } from 'vue-sequence'
import 'vue-sequence/dist/vue-sequence.css'
// eslint-disable-next-line
console.log(Version)

import MockApConfluence from './utils/MockApConfluence'
import Macro from './utils/Macro'
import Editor from './components/Editor'
import Workspace from './components/Workspace'

// Code Editor style
import 'codemirror/lib/codemirror.css'
// theme css
import 'codemirror/theme/base16-dark.css'

Vue.config.productionTip = false

Vue.component('seq-diagram', SeqDiagram)
Vue.component('editor', Editor)
Vue.component('workspace', Workspace)
Vue.use(VueCodeMirror)

Vue.use(Vuex)
Store.state.styles = {}
const store = new Vuex.Store(Store);

new Vue({
  store,
  render: h => h(Workspace) // with this method, we don't need to use full version of vew
}).$mount('#app')
window.store = store

if (window.location.href.includes('localhost')) {
  // eslint-disable-next-line
  console.log('You are using a mocked AP.confluence')
  window.AP = {
    confluence: new MockApConfluence()
  }
}

window.Macro = Macro
if(window.onAppLoaded) {
  window.onAppLoaded();
}