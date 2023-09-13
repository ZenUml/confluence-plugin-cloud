import Vue, { Component } from "vue";
import {Diagram} from "@/model/Diagram/Diagram";
import store from "@/model/store2";

export function mountRoot(doc: Diagram, component: Component) {
  console.debug('Mounting root', doc);
  store.state.diagram = doc;
  if (document.getElementById('app')) {
    new Vue({
      store,
      render: (h: Function) => h(component) // with this method, we don't need to use full version of vue
    }).$mount('#app')
  }
}
