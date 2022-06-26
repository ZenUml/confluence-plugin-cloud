import SwaggerEditorBundle from 'swagger-editor'
import SpecListener from './utils/spec-listener'

import Vue from 'vue'
import Macro from "./model/Macro";
import SaveAndGoBackButtonOpenAPI from "@/components/SaveAndGoBackButtonOpenAPI.vue";
// @ts-ignore
import Va from 'vue-atlas'
import 'vue-atlas/dist/vue-atlas.css'
import ApWrapper2 from "@/model/ApWrapper2";
import AP from "@/model/AP";
Vue.use(Va, 'en')

new Vue({
  render: h => h(SaveAndGoBackButtonOpenAPI)
}).$mount('#save-and-go-back');

async function initializeMacro() {
  const apWrapper = new ApWrapper2(AP);
  await apWrapper.initializeContext();
  
  const macro = new Macro(apWrapper);

  // @ts-ignore
  window.macro = macro;
  // const {code} = await macro.load();
  let code = 'OpenAPI Example'

  if(code) {
    // eslint-disable-next-line
    // @ts-ignore
    window.updateSpec(code);
    console.log('-------------- updateSpec with:', code)
  }
}


// eslint-disable-next-line
// @ts-ignore
window.SwaggerEditorBundle = SwaggerEditorBundle;

window.onload = function () {
  // Build a system
  const editor = SwaggerEditorBundle({
    dom_id: '#swagger-editor',
    // layout: 'StandaloneLayout',
    presets: [
      // SwaggerEditorStandalonePreset
    ],
    plugins: [SpecListener],
    // url: 'https://raw.githubusercontent.com/OAI/OpenAPI-Specification/main/examples/v3.0/uspto.json'
  })

  // eslint-disable-next-line
  // @ts-ignore
  window.editor = editor


  initializeMacro();
}