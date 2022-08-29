import SwaggerEditorBundle from 'swagger-editor'
import SpecListener from './utils/spec-listener'

import Vue from 'vue'
import SaveAndGoBackButton from "@/components/SaveAndGoBackButton.vue";
// @ts-ignore
import './assets/tailwind.css'

import '@/components/Debug/DebugMounter.ts'
import Example from '@/model/OpenApi/OpenApiExample'
import globals from '@/model/globals';
import AP from "@/model/AP";
import {DataSource, DiagramType} from "@/model/Diagram/Diagram";
import defaultContentProvider from "@/model/ContentProvider/CompositeContentProvider";
import {CustomContentStorageProvider} from "@/model/ContentProvider/CustomContentStorageProvider";
import {MacroIdProvider} from "@/model/ContentProvider/MacroIdProvider";

new Vue({
  render: h => h(SaveAndGoBackButton, {
    props: {
      saveAndExit: async function () {
        const customContentStorageProvider = new CustomContentStorageProvider(AP);
        // @ts-ignore
        const code = window.specContent;
        const diagram = {
          title: '',
          code: code,
          styles: {},
          mermaidCode: '',
          diagramType: DiagramType.OpenApi,
          source: DataSource.CustomContent
        };
        const id = await customContentStorageProvider.save(diagram);
        const macroIdProvider = new MacroIdProvider(AP);
        await macroIdProvider.save(id);

        /* eslint-disable no-undef */
        AP.dialog.close();
      }
    },
  })
}).$mount('#save-and-go-back');

async function initializeMacro() {
  const apWrapper = globals.apWrapper;
  await apWrapper.initializeContext();

  const compositeContentProvider = defaultContentProvider(AP);
  const {doc} = await compositeContentProvider.load();
  console.log('-------------- loaded spec:', doc?.code)
    // eslint-disable-next-line
    // @ts-ignore
    window.updateSpec(doc?.code || Example);
    console.log('-------------- updateSpec with:', doc?.code)
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