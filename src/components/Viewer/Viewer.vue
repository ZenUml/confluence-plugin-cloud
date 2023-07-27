<template>
<!-- screen-capture-content class is used in Attachment.js to select the node. -->
<div class="viewer mx-1 pr-2" :class="{'screen-capture-content': diagramType === 'sequence'}">
  <Debug v-if="diagramType === 'sequence'"/>
  <error-boundary>
  <div v-html="styles"></div>
  <div v-show="diagramType === 'mermaid'">
    <mermaid-viewer/>
  </div>
  <div v-show="diagramType === 'sequence'" @click="deselectAll">
    <styling-panel/>
    {{diagramType}}
    <div ref="zenuml"></div>
  </div>
  </error-boundary>
</div>
</template>

<script>
import {mapState, mapGetters} from "vuex";
import ZenUml from '@zenuml/core'
import MermaidViewer from './MermaidViewer.vue'
import EventBus from '../../EventBus'
import Debug from '@/components/Debug/Debug.vue'
import StylingPanel from "@/components/StylingPanel";
import ErrorBoundary from "@/components/ErrorBoundary";
import globals from '@/model/globals';
import {DataSource, DiagramType, NULL_DIAGRAM} from "@/model/Diagram/Diagram";
import defaultContentProvider from "@/model/ContentProvider/CompositeContentProvider";
import AP from "@/model/AP";
import Example from "@/utils/sequence/Example";
import ApWrapper2 from "@/model/ApWrapper2";
// const DiagramFrame = VueSequence.DiagramFrame;
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
    Debug,
    ErrorBoundary,
    MermaidViewer,
    StylingPanel,
  },
  computed: {
    // We use {} instead of [] to get type checking
    ...mapState({
      diagramType: state => state.diagramType,
      diagram: state => state.diagram,
      code2: state => state.code2,
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
    await zenuml.render('A.method1', 'theme-mermaid');
  },
  async created() {
    const compositeContentProvider = defaultContentProvider(new ApWrapper2(AP));
    const {doc} = await compositeContentProvider.load();
    this.$store.state.diagram = doc;
    this.doc = doc;
    await globals.apWrapper.initializeContext();
    const canUserEditPage = await globals.apWrapper.canUserEdit();
    const storedWithCustomContent = this.doc?.source === DataSource.CustomContent;
    const notCopy = !this.doc?.isCopy;
    this.canUserEdit = canUserEditPage && storedWithCustomContent && notCopy;
  },
  watch: {
    diagram(doc, oldDoc) {
      console.debug('Viewer - Document changed - new: ', doc, ', old: ', oldDoc);

      this.$store.commit('updateDiagramType', ( !this.doc.diagramType || this.doc.diagramType === DiagramType.Unknown) ? DiagramType.Sequence : this.doc.diagramType);
      if (doc.diagramType === 'mermaid') {
        this.$store.dispatch('updateMermaidCode', doc.mermaidCode || Example.Mermaid);
        EventBus.$emit('diagramLoaded', doc.mermaidCode, doc.diagramType);
      } else {
        zenuml.render(doc.code || Example.Sequence, 'theme-default')
        this.$store.commit('code', doc.code || Example.Sequence);
        this.rawStyles = doc.styles || {};
        EventBus.$emit('diagramLoaded', doc.code, doc.diagramType);
      }
    },
    async code2(code, oldCode) {
      console.debug('Viewer - Code changed - new: ', code, ', old: ', oldCode);
      await zenuml.render(code, 'theme-mermaid');

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
