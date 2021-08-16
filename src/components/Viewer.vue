<template>
<div class="viewer">
  <div class="actions" v-show="this.$store.getters.isDisplayMode">
    <button @click="edit">Edit</button>
    <button @click="fullscreen">Fullscreen</button>
  </div>
  <div v-html="styles"></div>
  <mermaid v-show="this.$store.getters.diagramType === 'mermaid'"/>
  <div v-show="this.$store.getters.diagramType === 'zenuml'" @click="deselectAll">
    <styling-panel/>
    <frame />
  </div>
</div>
</template>

<script>
import { Frame } from 'vue-sequence'
import Mermaid from './Mermaid'
import EventBus from '../EventBus'

import StylingPanel from "@/components/StylingPanel";

export default {
  name: "Viewer",
  components: {
    Mermaid,
    StylingPanel,
    Frame
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
    edit() {
      EventBus.$emit('edit');
    },
    fullscreen() {
      EventBus.$emit('fullscreen');
    },
  },
}
</script>

<style scoped>
.viewer {
  margin-left: 5px;
}
.actions {
  float: right
}
</style>