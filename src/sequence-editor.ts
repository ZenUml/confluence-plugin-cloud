import Vue from 'vue'
import Vuex from 'vuex'

import Workspace from './components/Workspace.vue'
import mermaid from 'mermaid'

// ==== CSS ====
import './assets/tailwind.css'
import 'vue-sequence/dist/vue-sequence.css'

import ExtendedStore from './model/Store'
import EventBus from './EventBus'
import AP from "@/model/AP";
import {DataSource} from "@/model/Diagram/Diagram";
import {saveToPlatform} from "@/model/ContentProvider/Persistence";

import './utils/IgnoreEsc.ts'

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

EventBus.$on('save', async () => {
  // @ts-ignore
  const diagram = { title: store.getters.title, code: store.state.code, styles: store.state.styles, mermaidCode: store.state.mermaidCode, diagramType: store.state.diagramType, source: DataSource.CustomContent };
  await saveToPlatform(diagram);
  // @ts-ignore
  AP.dialog.close();
});
