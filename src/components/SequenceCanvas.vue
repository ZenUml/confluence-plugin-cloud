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
  name: "SequenceCanvas",
  computed: {
    code() {
      return this.$store.state.diagram.diagramType === DiagramType.Sequence
          && this.$store.state.diagram.code
    }
  },
  async mounted() {
    console.debug('SequenceCanvas - mounted', );
    zenuml = new ZenUml(this.$refs['zenuml']);
    await zenuml.render(this.$store.state.diagram.code, 'theme-default');
    EventBus.$emit('diagramLoaded', this.$store.state.diagram.code, this.$store.state.diagram.diagramType);
  },
  watch: {
    // watch in general is not a good idea, but it seems that this is the only native way to trigger reactivity.
    // another way would be use the https://www.npmjs.com/package/vue-async-computed
    async code() {
      if (!this.code) return;
      await zenuml.render(this.$store.state.diagram.code, 'theme-default');
    }
  },

}
</script>

<style scoped>

</style>
