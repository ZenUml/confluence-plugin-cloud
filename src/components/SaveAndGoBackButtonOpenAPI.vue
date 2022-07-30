<template>
  <va-button class="save-and-exit fixed right-3 top-1 z-50" type="primary" icon-before="angle-left" @click="saveAndExit">Save and Go back to Confluence</va-button>
</template>

<script>
import globals from "@/model/globals";
import { DiagramType } from "@/model/Diagram";
export default {
  name: "SaveAndGoBackButtonOpenAPI",
  methods: {
    saveAndExit: async function () {
      // eslint-disable-next-line no-undef
      await globals.macro.save({title: '', code: window.specContent, styles: '', mermaidCode: '', diagramType: DiagramType.OpenAPI, source: 'CustomContent'});

      /* eslint-disable no-undef */
      AP.dialog.close();
    }
  }
}
</script>
