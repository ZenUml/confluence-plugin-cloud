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
import defaultContentProvider from "@/model/ContentProvider/CompositeContentProvider";
import AP from "@/model/AP";
import globals from "@/model/globals";
import {DiagramType, NULL_DIAGRAM} from "@/model/Diagram/Diagram";
import Example from "@/utils/sequence/Example";
import ApWrapper2 from "@/model/ApWrapper2";
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
  watch: {
    diagramType:function (newCode) {
      if(newCode === 'unknown') {
        console.warn('diagramType is unknown');
        return;
      }
      this.valueMermaid = this.diagram.mermaidCode || Example.Mermaid;
      this.valueSequence = this.diagram.code || Example.Sequence;
    }
  },
  methods: {
    onEditorCodeChangeMermaid: function (newCode) {
      console.debug('onEditorCodeChange', newCode.doc.toString());
      this.$store.dispatch('updateMermaidCode', newCode.doc.toString());
    },
    onEditorCodeChangeSequence: function (newCode) {
      console.debug('onEditorCodeChange', newCode.doc.toString());
      this.$store.dispatch('updateCode2', newCode.doc.toString());
    }
  },
  computed: {
    ...mapState({
      diagramType: state => state.diagram.diagramType,
      diagram: state => state.diagram,
    }),
  },
  async created() {
    this.valueSequence = this.diagram.code;
    this.valueMermaid = this.diagram.mermaidCode;
    this.canUserEdit = await globals.apWrapper.canUserEdit();
  },
  components: {CodeMirror}
}

</script>
