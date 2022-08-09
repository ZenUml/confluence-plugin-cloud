import Vue from 'vue'
import DocumentList from './components/DocumentList/DocumentList.vue'

import EventBus from './EventBus'
import './GTagConfig'
import AP from "@/model/AP";
import './assets/tailwind.css'
import {MacroIdProvider} from "@/model/ContentProvider/MacroIdProvider";

Vue.config.productionTip = false

if(document.getElementById('app')) {
    new Vue({
      render: h => h(DocumentList)
    }).$mount('#app')
}
EventBus.$on('save', async () => {
  const idProvider = new MacroIdProvider(AP);
  // @ts-ignore
  await idProvider.save(window.picked.id)
  // @ts-ignore
  AP.dialog.close();
});
