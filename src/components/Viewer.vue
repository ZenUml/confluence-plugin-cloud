<template>
<div class="viewer">
  <div v-html="styles"></div>
  <mermaid v-show="this.$store.getters.diagramType === 'mermaid'"/>
  <div v-show="this.$store.getters.diagramType === 'zenuml'" @click="deselectAll">
    <styling-panel/>
    <seq-diagram />
  </div>
</div>
</template>

<script>
import { SeqDiagram } from 'vue-sequence'
import Mermaid from './Mermaid'

import StylingPanel from "@/components/StylingPanel";

export default {
  name: "Viewer",
  components: {
    Mermaid,
    StylingPanel,
    SeqDiagram
  },
  computed: {
    styles() {
      const stylesInStore = this.$store.state.styles;
      const statements = Object.keys(stylesInStore)
          .map(k => `${k} .participant { background: ${stylesInStore[k].backgroundColor}; }`)
          .join('\n');
      return `<style> ${statements}</style>`;
    },
  },
  methods: {
    deselectAll(event) {
      let el = event.target
      while (el) {
        if (el.classList && (el.classList.contains('participant') || el.classList.contains('vue-swatches'))) {
          return
        }
        el = el.parentNode
      }
      this.$store.state.selected = []
    },
  },
}
</script>

<style scoped>

</style>