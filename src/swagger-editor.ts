import SwaggerEditorBundle from 'swagger-editor'
import "swagger-editor/dist/swagger-editor.css";
import SpecListener from './utils/spec-listener'

import React from 'react';
import ReactDOM from 'react-dom';
import { SaveAndGoBackButton } from "@/components/react/SaveAndGoBackButton";
// @ts-ignore
import './assets/tailwind.css'

import OpenApiExample from '@/model/OpenApi/OpenApiExample'
import globals from '@/model/globals';
import AP from "@/model/AP";
import './utils/IgnoreEsc.ts'
import {DataSource, DiagramType} from "@/model/Diagram/Diagram";
import defaultContentProvider from "@/model/ContentProvider/CompositeContentProvider";
import {saveToPlatform} from "@/model/ContentProvider/Persistence";
import ApWrapper2 from "@/model/ApWrapper2";
import MacroUtil from "@/model/MacroUtil";
import {trackEvent} from '@/utils/window';

async function saveOpenApiAndExit () {
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
  // @ts-ignore
  window.diagram = Object.assign(window.diagram || {}, diagram);
  // @ts-ignore
  await saveToPlatform(window.diagram);

  /* eslint-disable no-undef */
  AP.dialog.close();
}

ReactDOM.render(
  React.createElement(SaveAndGoBackButton as any, { saveAndExit: saveOpenApiAndExit }),
  document.getElementById('save-and-go-back')
);

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


  if(await MacroUtil.isCreateNew()) {
    trackEvent('', 'create_macro_begin', 'openapi');
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
