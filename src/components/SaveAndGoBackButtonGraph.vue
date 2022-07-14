<template>
  <va-button class="save-and-exit fixed right-0 top-0" type="primary" icon-before="angle-left" @click="saveAndExit">Save and Go back to Confluence</va-button>
</template>

<script>

export default {
  name: "SaveAndGoBackButtonGraph",
  methods: {
    saveAndExit: async function () {
      // eslint-disable-next-line no-undef
      await window.macro.save2(getGraphXml());
      /* eslint-disable no-undef */
      AP.dialog.close();
    }
  }
}
</script>
