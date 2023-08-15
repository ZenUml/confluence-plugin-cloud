<template>
<!-- screen-capture-content class is used in Attachment.js to select the node. -->
<div class="viewer mx-1 pr-2" :class="{'screen-capture-content': diagramType === 'sequence'}">
  <div v-show="diagramType === 'mermaid'">
    <mermaid-viewer/>
  </div>
  <div v-show="diagramType === 'sequence'" @click="deselectAll">
    <styling-panel/>
    <generic-viewer>
      <div ref="zenuml"></div>
    </generic-viewer>
  </div>
</div>
</template>

<script>
import {mapState, mapGetters} from "vuex";
import ZenUml from '@zenuml/core'
import MermaidViewer from './MermaidViewer.vue'
import EventBus from '../../EventBus'
import StylingPanel from "@/components/StylingPanel";
import globals from '@/model/globals';
import {DataSource, DiagramType, NULL_DIAGRAM} from "@/model/Diagram/Diagram";
import defaultContentProvider from "@/model/ContentProvider/CompositeContentProvider";
import AP from "@/model/AP";
import Example from "@/utils/sequence/Example";
import ApWrapper2 from "@/model/ApWrapper2";
import GenericViewer from "@/components/Viewer/GenericViewer.vue";
let zenuml;
export default {
  name: "Viewer",
  data: () => {
    return {
      doc: NULL_DIAGRAM,
      canUserEdit: false,
      rawStyles: {},
    }
  },
  components: {
    GenericViewer,
    MermaidViewer,
    StylingPanel,
  },
  computed: {
    // We use {} instead of [] to get type checking
    ...mapState({
      diagramType: state => state.diagram.diagramType,
      diagram: state => state.diagram,
      code2: state => state.diagram.code,
    }),
    ...mapGetters({isDisplayMode: 'isDisplayMode'}),
    isLite() {
      return globals.apWrapper.isLite();
    },
    styles() {
      const statements = Object.keys(this.rawStyles)
          .map(k => `${k} .participant { background: ${(this.rawStyles)[k].backgroundColor}; }`)
          .join('\n');
      return `<style> ${statements}</style>`;
    },
  },
  async mounted() {
    console.log('Viewer - mounted', );
    zenuml = new ZenUml(this.$refs['zenuml']);
    await zenuml.render(this.code2, 'theme-mermaid');
  },
  async created() {
  },
  watch: {
    async code2(code, oldCode) {
      console.debug('Viewer - Code changed - new: ', code, ', old: ', oldCode);
      await zenuml?.render(code, 'theme-default');
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
