<template>
  <va-button class="save-and-exit" type="primary" icon-before="angle-left" @click="saveAndExit">Save and Go back to Confluence</va-button>
</template>

<script>
// import {mapState,mapGetters} from "vuex";
import EventBus from '../EventBus'

export default {
  name: "SaveAndGoBackButton",
  computed: {
    // ...mapState(['macro', 'code', 'styles', 'mermaidCode', 'diagramType']),
    // ...mapGetters(['title'])
  },
  methods: {
    saveAndExit: async function () {
      // await this.macro.save2(this.code, this.styles, this.mermaidCode, this.diagramType, this.title);
      EventBus.$emit('save');
      /* eslint-disable no-undef */
      // AP.dialog.close();
    }
  }
}
</script>

<style scoped>

</style>