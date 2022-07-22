import SwaggerEditorBundle from 'swagger-editor'
import SpecListener from './utils/spec-listener'

import Vue from 'vue'
import BaseMacro2 from "./model/BaseMacro2";
import SaveAndGoBackButtonOpenAPI from "@/components/SaveAndGoBackButtonOpenAPI.vue";
// @ts-ignore
import Va from 'vue-atlas'
import 'vue-atlas/dist/vue-atlas.css'
import './assets/tailwind.css'

import '@/components/Debug/DebugMounter.ts'
import Example from '@/model/OpenApi/OpenApiExample'
import globals from '@/model/globals';

Vue.use(Va, 'en')

new Vue({
  render: h => h(SaveAndGoBackButtonOpenAPI)
}).$mount('#save-and-go-back');

async function initializeMacro() {
  const apWrapper = globals.apWrapper;
  await apWrapper.initializeContext();

  const macro = new BaseMacro2(apWrapper);
  // await macro.load();

  // @ts-ignore
  globals.macro = macro;
  const {code} = await macro.load();
  console.log('-------------- loaded spec:', code)
    // eslint-disable-next-line
    // @ts-ignore
    window.updateSpec(code || Example);
    console.log('-------------- updateSpec with:', code)
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