import './assets/tailwind.css'
import Workspace from './components/Workspace.vue'
import defaultContentProvider from "@/model/ContentProvider/CompositeContentProvider";
import globals from "@/model/globals";
import {mountApp} from "@/mount-app";

async function main() {
  const compositeContentProvider = defaultContentProvider(globals.apWrapper);
  let {doc} = await compositeContentProvider.load();
  await globals.apWrapper.initializeContext();
  mountApp(Workspace, doc);
}

// We do not have to export main(), but otherwise IDE shows a warning
export default main();
