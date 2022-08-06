import Vue from 'vue'
import DocumentList from './components/DocumentList/DocumentList.vue'

import EventBus from './EventBus'
import './GTagConfig'
import globals from '@/model/globals';
import AP from "@/model/AP";
import './assets/tailwind.css'

Vue.config.productionTip = false

if(document.getElementById('app')) {
    new Vue({
      render: h => h(DocumentList)
    }).$mount('#app')
}
EventBus.$on('save', async () => {

  // eslint-disable-next-line
  // @ts-ignore
  const diagram = JSON.parse(window.picked.body.raw.value);

  // eslint-disable-next-line
  // @ts-ignore
  await globals.macro.saveEmbedded(window.picked.id, window.picked.type, diagram);

  // @ts-ignore
  AP.dialog.close();
});
