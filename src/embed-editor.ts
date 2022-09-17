import Vue from 'vue'
import DocumentList from './components/DocumentList/DocumentList.vue'

import EventBus from './EventBus'
import AP from "@/model/AP";
import './assets/tailwind.css'
import './utils/IgnoreEsc.ts'
import {MacroIdProvider} from "@/model/ContentProvider/MacroIdProvider";
import ApWrapper2 from "@/model/ApWrapper2";

Vue.config.productionTip = false

if(document.getElementById('app')) {
    new Vue({
      render: h => h(DocumentList)
    }).$mount('#app')
}
EventBus.$on('save', async () => {
  const idProvider = new MacroIdProvider(new ApWrapper2(AP));
  // @ts-ignore
  await idProvider.save(window.picked.id)
  // @ts-ignore
  AP.dialog.close();
});
