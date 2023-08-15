import Workspace from './components/Workspace.vue'
import defaultContentProvider from "@/model/ContentProvider/CompositeContentProvider";
import globals from "@/model/globals";
import {mountApp} from "@/mount-app";
// TODO: This has to be imported as the bottom of the list
// It has conflict with other CSS added also for tailwind
// button,
// [type='button'],
// [type='reset'],
// [type='submit'] {
//   -webkit-appearance: button; /* 1 */
//   background-color: transparent; /* 2 */
//   background-image: none; /* 2 */
// }
import './assets/tailwind.css'

async function main() {
  const compositeContentProvider = defaultContentProvider(globals.apWrapper);
  let {doc} = await compositeContentProvider.load();
  await globals.apWrapper.initializeContext();
  mountApp(Workspace, doc);
}

// We do not have to export main(), but otherwise IDE shows a warning
export default main();
