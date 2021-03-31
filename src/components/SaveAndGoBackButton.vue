<template>
  <va-button class="save-and-exit" type="primary" icon-before="angle-left" @click="saveAndExit">Save and Go back to Confluence</va-button>
</template>

<script>
import {mapState} from "vuex";

export default {
  name: "SaveAndGoBackButton",
  computed: {
    ...mapState(['macro', 'code', 'style', 'mermaidCode', 'diagramType']),
  },
  methods: {
    saveAndExit: async function () {
      await this.macro.save(this.code, this.style, this.mermaidCode, this.diagramType);
      /* eslint-disable no-undef */
      AP.dialog.close();
    }
  }
}
</script>

<style scoped>

</style>