<template>
  <div>
    <div ref="zenuml"></div>
  </div>
</template>

<script>
import ZenUml from '@zenuml/core';
import EventBus from "@/EventBus";
export default {
  name: "SequenceCanvas",
  async mounted() {
    console.log('Viewer - mounted', );
    const zenuml = new ZenUml(this.$refs['zenuml']);
    await zenuml.render(this.$store.state.diagram.code, 'theme-default');
    EventBus.$emit('diagramLoaded', this.$store.state.diagram.code, this.$store.state.diagram.diagramType);
  },
}
</script>

<style scoped>

</style>
