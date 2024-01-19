import Vue, { Component } from "vue";
import {Diagram} from "@/model/Diagram/Diagram";
import store from "@/model/store2";

export function mountRoot(doc: Diagram, component: Component) {
  console.debug('Mounting root', doc);
  // extract title from diagram code
  if (!doc.title && doc.diagramType === 'sequence') {
    const firstLine = doc.code?.split('\n')[0];
    if (firstLine?.trimStart().startsWith('title ')) {
      doc.title = firstLine.trimStart().substring(6).trim();
    }
  }
  store.state.diagram = doc;
  if (document.getElementById('app')) {
    new Vue({
      store,
      render: (h: Function) => h(component) // with this method, we don't need to use full version of vue
    }).$mount('#app')
  }
}
