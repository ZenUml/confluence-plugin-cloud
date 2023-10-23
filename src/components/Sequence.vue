<template>
  <div>
    <div ref="zenuml"></div>
  </div>
</template>

<script>
import ZenUml from '@zenuml/core';
import EventBus from "@/EventBus";
import {DiagramType} from "@/model/Diagram/Diagram";
let zenuml;
export default {
  name: "Sequence",
  computed: {
    code() {
      return (
        this.$store.state.diagram.diagramType === DiagramType.Sequence &&
        this.$store.state.diagram.code
      );
    }
  },
  async mounted() {
    console.debug('SequenceCanvas - mounted', );
    zenuml = new ZenUml(this.$refs['zenuml']);
    await this.render();
    EventBus.$emit('diagramLoaded', this.$store.state.diagram.code, this.$store.state.diagram.diagramType);
  },
  methods: {
    async render() {
      // stickyOffset is used only at view mode or edit when the iframe scroll out of the viewport
      // In fullscreen viewer or editor mode, the iFrame element is not scrollable, so we don't need to offset.
      // Note when the iframe is not scrollable, the stickyOffset does not have any effect.
      const theme =
        localStorage.getItem(`${location.hostname}-zenuml-theme`) ||
        "theme-default";
      await zenuml.render(this.$store.state.diagram.code, {
        theme,
        stickyOffset: 56,
        onContentChange: this.updateCode
      });
    },
    updateCode(newCode) {
      this.$store.dispatch("updateCode2", newCode);
      EventBus.$emit('updateContent', this.$store.state.diagram);
    }
  },
  watch: {
    // watch in general is not a good idea, but it seems that this is the only native way to trigger reactivity.
    // another way would be use the https://www.npmjs.com/package/vue-async-computed
    async code() {
      if (!this.code) return;
      await this.render();
    }
  }
};
</script>

<style scoped></style>
