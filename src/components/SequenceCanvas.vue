<template>
  <div>
    <div ref="zenuml"></div>
  </div>
</template>

<script>
import ZenUml from '@zenuml/core';
export default {
  name: "SequenceCanvas",
  async mounted() {
    console.log('Viewer - mounted', );
    const zenuml = new ZenUml(this.$refs['zenuml']);
    await zenuml.render(this.$store.state.diagram.code, 'theme-default');
  },
}
</script>

<style scoped>

</style>
