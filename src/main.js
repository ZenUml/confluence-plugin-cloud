import Vue from 'vue'
import Vuex from 'vuex'
import VueCodeMirror from 'vue-codemirror'

import { Version, SeqDiagram, Store } from 'vue-sequence'
import 'vue-sequence/dist/vue-sequence.css'
// eslint-disable-next-line
console.log(Version)
import Editor from './components/Editor'
import Workspace from './components/Workspace'
import App from './App'


Vue.config.productionTip = false

Vue.component('seq-diagram', SeqDiagram)
Vue.component('editor', Editor)
Vue.component('workspace', Workspace)
Vue.use(VueCodeMirror)

Vue.use(Vuex)
const store = new Vuex.Store(Store);

new Vue({
  store,
  render: h => h(App) // with this method, we don't need to use full version of vew
}).$mount('#app')
window.store = store
if(window.onAppLoaded) {
  window.onAppLoaded();
}