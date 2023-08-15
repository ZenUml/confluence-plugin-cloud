import { createApp } from 'vue'
import {createStore} from 'vuex'

import ExtendedStore from "@/model/Store";
import {Diagram} from "@/model/Diagram/Diagram";

export function mountApp(component: any, doc: Diagram) {
  console.log('mount the root node of the app');
  const store = createStore(ExtendedStore);
  store.state.diagram = doc;

  const id= 'app';
  if (document.getElementById(id)) {
    const app = createApp(component);
    app.use(store);
    app.mount(`#${id}`);
  }
}
