import { createApp } from 'vue'
import { createStore } from 'vuex'
import Workspace from './components/Workspace.vue'
import mermaid from 'mermaid'

// ==== CSS ====
import './assets/tailwind.css'

import ExtendedStore from './model/Store'
import EventBus from './EventBus'
import AP from "@/model/AP";
import {DataSource} from "@/model/Diagram/Diagram";
import {saveToPlatform} from "@/model/ContentProvider/Persistence";

import './utils/IgnoreEsc.ts'

// @ts-ignore
window.mermaid = mermaid

mermaid.mermaidAPI.initialize({
  startOnLoad:true
})

const store = createStore(ExtendedStore);
if(document.getElementById('app')) {
  const app = createApp(Workspace);
  app.use(store);

  app.mount('#app');
}
// @ts-ignore
window.store = store

EventBus.$on('save', async () => {
  // @ts-ignore
  const diagram = { title: store.getters.title, code: store.state.code2, styles: store.state.styles, mermaidCode: store.state.mermaidCode, diagramType: store.state.diagramType, source: DataSource.CustomContent };
  await saveToPlatform(diagram);
  // @ts-ignore
  AP.dialog.close();
});
