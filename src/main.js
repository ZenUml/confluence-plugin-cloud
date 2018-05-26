import Vue from 'vue'
import Vuex from 'vuex'
import { SeqDiagram, Store } from 'vue-sequence'
import 'vue-sequence/dist/vue-sequence.css'


Vue.config.productionTip = false

Vue.component('seq-diagram', SeqDiagram)
Vue.use(Vuex)
const store = new Vuex.Store(Store);

new Vue({
  store
}).$mount('#app')
store.commit('code', 'A.method()')
// Equals to the above
// new Vue({
//   store
//   el: '#app'
// })