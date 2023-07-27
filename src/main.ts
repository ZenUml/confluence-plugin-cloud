import { createApp } from 'vue'
import { createStore } from 'vuex'
import Workspace from './components/Workspace.vue'
import mermaid from 'mermaid'
import './assets/tailwind.css'
import ExtendedStore from './model/Store'

// @ts-ignore
window.mermaid = mermaid;

mermaid.mermaidAPI.initialize({
  startOnLoad:true
})

const store = createStore(ExtendedStore);
if(document.getElementById('app')) {
  const app = createApp(Workspace);
  store.dispatch('updateCode', { code: 'this._code' });
  // As VueSequence is being used, it might be necessary to apply additional properties or settings to the app.
  // For example, if VueSequence provides any plugins or global components, they should be applied here.
  // The specifics depend on how VueSequence is meant to be used with Vue 3.
  app.use(store)
  app.mount('#app');
}
