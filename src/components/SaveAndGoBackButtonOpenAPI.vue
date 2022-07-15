<template>
  <va-button class="save-and-exit fixed right-3 top-1 z-50" type="primary" icon-before="angle-left" @click="saveAndExit">Save and Go back to Confluence</va-button>
</template>

<script>

export default {
  name: "SaveAndGoBackButtonOpenAPI",
  methods: {
    saveAndExit: async function () {
      // eslint-disable-next-line no-undef
      await window.macro.save({title: '', code: window.specContent, styles: '', mermaidCode: '', diagramType: 'OpenAPI', source: 'CustomContent'});

      /* eslint-disable no-undef */
      AP.dialog.close();
    }
  }
}
</script>
