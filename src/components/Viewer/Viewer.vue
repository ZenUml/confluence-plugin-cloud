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
import {DataSource, NULL_DIAGRAM} from "@/model/Diagram/Diagram";
import defaultContentProvider from "@/model/ContentProvider/CompositeContentProvider";
import AP from "@/model/AP";
import Example from "@/utils/sequence/Example";
import ApWrapper2 from "@/model/ApWrapper2";
import GenericViewer from "@/components/Viewer/GenericViewer.vue";
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
    await zenuml.render('A.method1', 'theme-mermaid');
  },
  async created() {
    const compositeContentProvider = defaultContentProvider(new ApWrapper2(AP));
    const {doc} = await compositeContentProvider.load();
    console.debug('Viewer - Document loaded: ', doc);
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

      if (doc.diagramType === 'mermaid') {
        this.$store.dispatch('updateMermaidCode', doc.mermaidCode || Example.Mermaid);
        EventBus.$emit('diagramLoaded', doc.mermaidCode, doc.diagramType);
      } else {
        zenuml?.render(doc.code || Example.Sequence, 'theme-default')
        this.$store.commit('updateCode2', doc.code || Example.Sequence);
        this.rawStyles = doc.styles || {};
        EventBus.$emit('diagramLoaded', doc.code, doc.diagramType);
      }
    },
    async code2(code, oldCode) {
      console.debug('Viewer - Code changed - new: ', code, ', old: ', oldCode);
      await zenuml?.render(code, 'theme-mermaid');
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
