<template>
  <div>
    <div class="flex justify-center" v-html="svg"></div>
  </div>
</template>

<script>
import mermaid from 'mermaid'
import EventBus from "@/EventBus";
import {DiagramType} from "@/model/Diagram/Diagram";
import {trackEvent} from "@/utils/window";
import globals from '@/model/globals';

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
    await globals.apWrapper.initializeContext();
    const macroData = await globals.apWrapper.getMacroData();
    trackEvent(macroData?.uuid, 'view_macro', 'mermaid');
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
      const { svg  } = await mermaid.mermaidAPI.render('any-id', code)
      return svg; 
    }
  }
}
</script>
