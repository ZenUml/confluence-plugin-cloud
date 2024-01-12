import { createApp } from 'vue'
import DocumentList from './components/DocumentList/DocumentList.vue'

import EventBus from './EventBus'
import AP from "@/model/AP";
import './assets/tailwind.css'
import './utils/IgnoreEsc.ts'
import ApWrapper2 from "@/model/ApWrapper2";
import uuidv4 from "@/utils/uuid";
import {trackEvent} from '@/utils/window';
import MacroUtil from "@/model/MacroUtil";

const apWrapper = new ApWrapper2(AP);

async function trackCreateNewEvent() {
  if(await MacroUtil.isCreateNew()) {
    await apWrapper.initializeContext();
    trackEvent('', 'create_macro_begin', 'embed');
  }
}

if(document.getElementById('app')) {
  const app = createApp(DocumentList)
  app.mount('#app')

  trackCreateNewEvent();
}

EventBus.$on('save', async () => {
  const macroData = await apWrapper.getMacroData();
  const uuid = macroData?.uuid || uuidv4();
  // @ts-ignore
  const params = { uuid, customContentId: window.picked.id, updatedAt: new Date() };
  apWrapper.saveMacro(params, '');

  if(!macroData?.uuid) {
    trackEvent(uuid, 'create_macro_end', 'embed');
  }

  // @ts-ignore
  AP.dialog.close();
});
