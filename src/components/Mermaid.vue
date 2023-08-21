<template>
  <div>
    <div v-html="svg"></div>
  </div>
</template>

<script>
import mermaid from 'mermaid'
import EventBus from "@/EventBus";

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
      return this.$store.state.diagram.diagramType === 'mermaid' && this.$store.state.diagram.mermaidCode;
    }
  },
  async mounted() {
    if (!this.code) return;
    this.svg = await this.render(this.code);
    EventBus.$emit('diagramLoaded', this.$store.state.diagram.code, this.$store.state.diagram.diagramType);
  },
  updated() {
    // Don't use updated() to render, because it will cause infinite loop.
  },
  watch: {
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
