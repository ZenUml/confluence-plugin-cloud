import Vue, { Component } from "vue";
import {Diagram} from "@/model/Diagram/Diagram";
import store from "@/model/store2";

export function mountRoot(doc: Diagram, component: Component) {
  store.state.diagram = doc;
  store.state.code = doc.code;
  store.state.diagramType = doc.diagramType;
  store.state.mermaidCode = doc.mermaidCode;
  if (document.getElementById('app')) {
    new Vue({
      store,
      render: (h: Function) => h(component) // with this method, we don't need to use full version of vue
    }).$mount('#app')
  }
}
