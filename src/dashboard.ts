import { createApp } from 'vue'
import DashboardDocumentList from './components/DocumentList/DashboardDocumentList.vue'

import EventBus from './EventBus'
import AP from "@/model/AP";
import './assets/tailwind.css'
import './utils/IgnoreEsc.ts'
import ApWrapper2 from "@/model/ApWrapper2";
import uuidv4 from "@/utils/uuid";
import {trackEvent} from '@/utils/window';

const apWrapper = new ApWrapper2(AP);

if(document.getElementById('app')) {
  const app = createApp(DashboardDocumentList);
  app.mount('#app')
  trackEvent('', 'load_dashboard', 'pageview');
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
