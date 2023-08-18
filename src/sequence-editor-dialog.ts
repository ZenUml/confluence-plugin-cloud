import ApWrapper2 from "@/model/ApWrapper2";
import defaultContentProvider from "@/model/ContentProvider/CompositeContentProvider";
import globals from "@/model/globals";

import Workspace from './components/Workspace.vue'
import {mountRoot} from "@/mount-root";

import store from './model/store2'
import EventBus from './EventBus'
import AP from "@/model/AP";
import './utils/IgnoreEsc.ts'

import './assets/tailwind.css'
import {saveToPlatform} from "@/model/ContentProvider/Persistence";

async function main() {
  await globals.apWrapper.initializeContext();
  const compositeContentProvider = defaultContentProvider(globals.apWrapper as ApWrapper2);
  let {doc} = await compositeContentProvider.load();
  mountRoot(doc, Workspace);
}

// We do not have to export main(), but otherwise IDE shows a warning
export default main();

EventBus.$on('save', async () => {
  await saveToPlatform(store.state.diagram);
  // @ts-ignore
  AP.dialog.close();
});
