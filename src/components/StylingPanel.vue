<template>
<div class="styling-panel"><v-swatches v-model="color" inline :show-checkbox="false" :swatches="swatches" @input="onColorSelected"></v-swatches></div>
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
    methods: {
      onColorSelected: function () {
        this.$store.state.selected.forEach(
          p => {
            const styles = this.$store.state.styles
            const style = {}
            style[p] = this.color
            this.$store.state.styles = Object.assign({}, styles, style)
          }
        )
      }
    },
    components: {VSwatches}
  }
</script>

<style scoped>

</style>