import Workspace from './components/Workspace.vue'
import defaultContentProvider from "@/model/ContentProvider/CompositeContentProvider";
import globals from "@/model/globals";
import {mountApp} from "@/mount-app";
import './assets/tailwind.css'

import EventBus from './EventBus'
import AP from "@/model/AP";
import './utils/IgnoreEsc.ts'

async function main() {
  const compositeContentProvider = defaultContentProvider(globals.apWrapper);
  let {doc} = await compositeContentProvider.load();
  await globals.apWrapper.initializeContext();
  mountApp(Workspace, doc);
}

export default main();

EventBus.$on('save', async () => {
  // @ts-ignore
  AP.dialog.close();
});
