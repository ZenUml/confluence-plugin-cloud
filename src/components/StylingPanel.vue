<template>
<div class="styling-panel"><v-swatches v-model="color" inline :swatches="swatches"></v-swatches></div>
</template>

<script>
  import VSwatches from './VueSwatches/VSwatches'
  export default {
    name: "StylingPanel",
    data() {
      return {
        color: '#1CA085',
        swatches: ['#8777d9', '#2684ff', '#57d9a3', '#ffc400', '#ff7452', '']
      }
    },
    components: {VSwatches}
  }
</script>

<style scoped>

</style>