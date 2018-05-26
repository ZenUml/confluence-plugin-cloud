import Vue from 'vue'
import Vuex from 'vuex'
import VueCodeMirror from 'vue-codemirror'
import Split from 'split.js'

import { SeqDiagram, Store } from 'vue-sequence'
import 'vue-sequence/dist/vue-sequence.css'

import Editor from './components/Editor'
import Workspace from './components/Workspace'


Vue.config.productionTip = false

Vue.component('seq-diagram', SeqDiagram)
Vue.component('editor', Editor)
Vue.component('workspace', Workspace)
Vue.use(VueCodeMirror)

Vue.use(Vuex)
const store = new Vuex.Store(Store);


new Vue({
  store
}).$mount('#app')
store.commit('code', 'A.method()')
window.Split = Split
// Equals to the above
// new Vue({
//   store
//   el: '#app'
// })