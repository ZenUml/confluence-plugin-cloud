import SwaggerEditorBundle from 'swagger-editor'
import SpecListener from './utils/spec-listener'
import { SaveButtonComponentPlugin } from './utils/save-button';

// @ts-ignore
import './assets/tailwind.css'

import OpenApiExample from '@/model/OpenApi/OpenApiExample'
import globals from '@/model/globals';
import AP from "@/model/AP";
import './utils/IgnoreEsc.ts'
import defaultContentProvider from "@/model/ContentProvider/CompositeContentProvider";
import ApWrapper2 from "@/model/ApWrapper2";

async function initializeMacro() {
  const apWrapper = globals.apWrapper;
  await apWrapper.initializeContext();

  const compositeContentProvider = defaultContentProvider(new ApWrapper2(AP));
  const {doc} = await compositeContentProvider.load();

  // @ts-ignore
  window.diagram = doc;

  console.log('-------------- loaded spec:', doc?.code)
    // eslint-disable-next-line
    // @ts-ignore
    window.updateSpec(doc?.code || OpenApiExample);
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
    plugins: [SpecListener, SaveButtonComponentPlugin ],
    // url: 'https://raw.githubusercontent.com/OAI/OpenAPI-Specification/main/examples/v3.0/uspto.json'
  })

  // eslint-disable-next-line
  // @ts-ignore
  window.editor = editor


  initializeMacro();
}