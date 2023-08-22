<template>
  <div>
    <div v-html="svg"></div>
  </div>
</template>

<script>
import mermaid from 'mermaid'
import EventBus from "@/EventBus";
import {DiagramType} from "@/model/Diagram/Diagram";

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
    mermaidCode() {
      return this.$store.state.diagram.diagramType === DiagramType.Mermaid && this.$store.state.diagram.mermaidCode;
    }
  },
  async mounted() {
    if (!this.mermaidCode) return;
    this.svg = await this.render(this.mermaidCode);
    EventBus.$emit('diagramLoaded', this.mermaidCode, this.$store.state.diagram.diagramType);
  },
  updated() {
    // Don't use updated() to render, because it will cause infinite loop.
  },
  watch: {
    async mermaidCode(newVal) {
      if (!newVal) {
        this.svg = 'Empty';
      } else {
        this.svg = await this.render(this.mermaidCode);
      }
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
