<template>
<div class="styling-panel" v-show="show">
  <v-swatches v-model="color" inline :show-checkbox="false"
              :swatches="swatches" @input="onColorSelected"
  ></v-swatches>
</div>
</template>

<script>
  import VSwatches from './VueSwatches/VSwatches'
  export default {
    name: "StylingPanel",
    data() {
      return {
        color: '',
        swatches: ['#8777d9', '#2684ff', '#57d9a3', '#ffc400', '#ff7452', '#5243aa', '#0052cc', '#00875a', '#ff991f', '#de350b', '']
      }
    },
    computed: {
      show() {
        return this.$store.state?.selected?.length > 0
      }
    },
    methods: {
      onColorSelected: function () {
        this.$store.state.selected.forEach(
          p => {
            const styles = this.$store.state.styles
            const style = {}
            style[`#${p}`] = {backgroundColor: this.color}
            this.$store.state.styles = Object.assign({}, styles, style)
          }
        )
      }
    },
    components: {VSwatches}
  }
</script>

<style>
  .container.view .styling-panel {
    display: none;
  }
</style>
<style scoped>
  .styling-panel {
    height: 34px;
    display: flex;
    margin: 2px 2px;
    background: #FFF;
    box-shadow: 0 2px 2px 0 rgba(0,0,0,0.14), 0 3px 1px -2px rgba(0,0,0,0.12), 0 1px 5px 0 rgba(0,0,0,0.2);
  }
</style>