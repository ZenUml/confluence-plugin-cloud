import Vue from 'vue'
import DocumentList from './components/DocumentList/DocumentList.vue'

import EventBus from './EventBus'
import AP from "@/model/AP";
import './assets/tailwind.css'
import './utils/IgnoreEsc.ts'
import ApWrapper2 from "@/model/ApWrapper2";
import uuidv4 from "@/utils/uuid";

Vue.config.productionTip = false

if(document.getElementById('app')) {
    new Vue({
      render: h => h(DocumentList)
    }).$mount('#app')
}
EventBus.$on('save', async () => {
  const apWrapper = new ApWrapper2(AP);
  const macroData = await apWrapper.getMacroData();
  const uuid = macroData?.uuid || uuidv4();
  // @ts-ignore
  const params = { uuid, customContentId: window.picked.id, updatedAt: new Date() };
  apWrapper.saveMacro(params, '');
  // @ts-ignore
  AP.dialog.close();
});
