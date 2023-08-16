<template>
  <div class="viewer mx-1 pr-2">
  <code-mirror v-show="diagramType === 'mermaid'" v-model="valueMermaid" ref="myCmMermaid"
               @change="onEditorCodeChangeMermaid"
               basic
               :dark="dark"
               :lang="cmOptions.language"/>
  <code-mirror v-show="diagramType === 'sequence'" v-model="valueSequence" ref="myCmSequence"
               @change="onEditorCodeChangeSequence"
               basic
               :dark="dark"
               :lang="cmOptions.language"/>
  </div>
</template>

<script>
import {mapState} from 'vuex';
import CodeMirror from 'vue-codemirror6';
import { javascript } from '@codemirror/lang-javascript';
import '@codemirror/autocomplete';
import globals from "@/model/globals";
import {DiagramType, NULL_DIAGRAM} from "@/model/Diagram/Diagram";
import defaultDiagram from "@/default-diagram";

const lang = javascript();
export default {
  name: 'editor',
  data() {
    return {
      dark: false,
      valueSequence: '',
      valueMermaid: '',
      doc: NULL_DIAGRAM,
      cmOptions: {
        language: lang,
        tabSize: 4,
        mode: 'text/javascript',
        theme: 'monokai',
        lineNumbers: true,
        line: true,
        keyMap: "sublime",
        extraKeys: {"Ctrl": "autocomplete"},
        foldGutter: true,
        gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"],
        styleSelectedText: true,
        highlightSelectionMatches: {showToken: /\w/, annotateScrollbar: true},
        placeholder: 'Write you code here',
        autoCloseBrackets: true,
      }
    }
  },
  mounted() {
    if(this.$store.state.diagram === NULL_DIAGRAM || this.$store.state.diagram.diagramType === DiagramType.Unknown) {
      console.warn('diagram is null');
      this.$store.state.diagram = defaultDiagram
    }
    this.valueMermaid = this.$store.state.diagram.mermaidCode;
    this.valueSequence = this.$store.state.diagram.code;
  },
  methods: {
    onEditorCodeChangeMermaid: function (newCode) {
      console.debug('onEditorCodeChange', newCode.doc.toString());
      this.$store.dispatch('updateMermaidCode', newCode.doc.toString());
    },
    onEditorCodeChangeSequence: function (newCode) {
      console.debug('onEditorCodeChange', newCode.doc.toString());
      this.$store.dispatch('updateCode2', newCode.doc.toString());
    },
  },
  computed: {
    ...mapState({
      diagramType: state => state.diagram.diagramType,
    }),
  },
  async created() {
    this.valueSequence = this.$store.state.diagram.code;
    this.valueMermaid = this.$store.state.diagram.mermaidCode;
    this.canUserEdit = await globals.apWrapper.canUserEdit();
  },
  components: {CodeMirror}
}

</script>
