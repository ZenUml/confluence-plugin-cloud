<template>
  <div>
    <div class="mermaid" v-html="svg"></div>
  </div>
</template>

<script>
import mermaid from 'mermaid'

mermaid.mermaidAPI.initialize({
  startOnLoad:true
})

export default {
  name: "Mermaid",
  data() {
    return {
      svg: 'Empty'
    }
  },
  computed: {
    code() {
      // if we do not use `diagramType === 'mermaid' &&` this value will not change when we switch the tabs
      // we cannot use mounted to initialise svg either (see comments in `mounted`).
      return this.$store.state.diagram.diagramType === 'mermaid' && this.$store.state.diagram.mermaidCode;
    }
  },
  async mounted() {
    if (!this.code) return;
    this.svg = await this.render(this.code);
  },
  updated() {
    // This is triggered when set this.svg, so it reenters the render loop. Not easy to get it right to move
    // watcher `code` to here.
  },
  watch: {
    // watch in general is not a good idea, but it seems that this is the only native way to trigger reactivity.
    // another way would be use the https://www.npmjs.com/package/vue-async-computed
    async code() {
      if (!this.code) return;
      this.svg = await this.render(this.code);
    }
  },
  methods: {
    async render(code) {
      return new Promise(resolve => {
        mermaid.mermaidAPI.render('any-id',
          code,
          (svg) => {
            resolve(svg)
          })
      })
    }
  }
}
</script>
