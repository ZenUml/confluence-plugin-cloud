import Vue from 'vue'
import Vuex from 'vuex'

import Workspace from './components/Workspace.vue'
import mermaid from 'mermaid'

// ==== CSS ====
// @ts-ignore
import './assets/tailwind.css'
import 'vue-sequence/dist/vue-sequence.css'

import ExtendedStore from './model/Store'
import EventBus from './EventBus'
import {CustomContentStorageProvider} from "@/model/ContentProvider/CustomContentStorageProvider";
import ApWrapper2 from "@/model/ApWrapper2";
import AP from "@/model/AP";
import {DataSource} from "@/model/Diagram/Diagram";
import {MacroIdProvider} from "@/model/ContentProvider/MacroIdProvider";
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

EventBus.$on('save', async () => {
  const apWrapper = new ApWrapper2(AP);
  const idProvider = new MacroIdProvider(apWrapper);
  // @ts-ignore

  const value = {id: await idProvider.getId(),code: store.state.code, styles: store.state.styles, mermaidCode: store.state.mermaidCode, diagramType: store.state.diagramType, title: store.getters.title, source: DataSource.CustomContent} as Diagram;
  const customContentStorageProvider = new CustomContentStorageProvider(apWrapper);
  await customContentStorageProvider.save(value);
  // @ts-ignore
  AP.dialog.close();
});
