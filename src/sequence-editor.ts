import ApWrapper2 from "@/model/ApWrapper2";
import defaultContentProvider from "@/model/ContentProvider/CompositeContentProvider";
import globals from "@/model/globals";

import Workspace from './components/Workspace.vue'
import {mountRoot} from "@/mount-root";

import store from './model/store2'
import EventBus from './EventBus'
import AP from "@/model/AP";

import {saveToPlatform} from "@/model/ContentProvider/Persistence";
import './utils/IgnoreEsc.ts'

import './assets/tailwind.css'
import {DiagramType, NULL_DIAGRAM} from "@/model/Diagram/Diagram";
import Example from "@/utils/sequence/Example";

async function main() {
  await globals.apWrapper.initializeContext();
  const compositeContentProvider = defaultContentProvider(globals.apWrapper as ApWrapper2);
  let {doc} = await compositeContentProvider.load();
  console.log('loaded document', doc);
  if(doc === NULL_DIAGRAM) {
    console.log('document is null, loading example');
    doc = {
      diagramType: DiagramType.Sequence,
      code: Example.Sequence,
      mermaidCode: Example.Mermaid
    }
  }
  mountRoot(doc, Workspace);
}

// We do not have to export main(), but otherwise IDE shows a warning
export default main();

EventBus.$on('save', async () => {
  await saveToPlatform(store.state.diagram);
  // @ts-ignore
  AP.dialog.close();
});
