import {createApp} from 'vue'
import {createStore} from 'vuex'
import Workspace from './components/Workspace.vue'

import mermaid from 'mermaid'
// ==== CSS ====
// @ts-ignore
import './assets/tailwind.css'

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

const store = createStore(ExtendedStore);
if(document.getElementById('app')) {
  const app = createApp(Workspace);
  app.use(store);
  app.mount('#app');
}

EventBus.$on('save', async () => {
  const apWrapper = new ApWrapper2(AP);
  const idProvider = new MacroIdProvider(apWrapper);
  // @ts-ignore

  const value = {id: await idProvider.getId(),code: store.state.code2, styles: store.state.styles, mermaidCode: store.state.mermaidCode, diagramType: store.state.diagramType, title: store.getters.title, source: DataSource.CustomContent} as Diagram;
  const customContentStorageProvider = new CustomContentStorageProvider(apWrapper);
  await customContentStorageProvider.save(value);
  // @ts-ignore
  AP.dialog.close();
});
