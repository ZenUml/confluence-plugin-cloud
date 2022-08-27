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
      // I don't know why we need `this.$store.state.diagramType === 'mermaid' &&` to trigger
      // reactivity. Otherwise, mermaid diagram is not rendered by default.
      return this.$store.state.diagramType === 'mermaid' && this.$store.state.mermaidCode;
    }
  },
  async mounted() {
    this.svg = await this.render(this.code);
  },
  watch: {
    async code() {
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