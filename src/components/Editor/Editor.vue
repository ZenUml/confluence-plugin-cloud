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
      console.debug('Editor - value', newCode);
      const isMermaid = this.diagramType === DiagramType.Mermaid;
      const result = isMermaid? this.diagram.mermaidCode || Example.Mermaid : this.diagram.code || Example.Sequence;
      console.debug('Editor - code', isMermaid, result);
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
      diagramType: state => state.diagramType,
      diagram: state => state.diagram,
    }),
    // code: {
    //   get(){
    //     const isMermaid = this.diagramType === DiagramType.Mermaid;
    //     const result = isMermaid? this.doc.mermaidCode || Example.Mermaid : this.doc.code || Example.Sequence;
    //     console.debug('Editor - code', isMermaid, result);
    //     return result;
    //   }, set() {
    //     // const isMermaid = this.diagramType === DiagramType.Mermaid;
    //     // console.debug('Editor - set code', isMermaid, newCode);
    //     // if (isMermaid) {
    //     //   this.$store.dispatch('updateMermaidCode', newCode);
    //     // } else {
    //     //   this.$store.dispatch('updateCode2', newCode);
    //     // }
    //   }
    // },

  },
  async created() {
    const compositeContentProvider = defaultContentProvider(new ApWrapper2(AP));
    const {doc} = await compositeContentProvider.load();
    console.debug('Editor - Document loaded:', doc);

    this.doc = doc;
    if (doc === NULL_DIAGRAM) {
      console.debug('Editor - Use default doc');

      this.doc ={
        diagramType: DiagramType.Sequence,
        code: Example.Sequence
      }
      this.$store.dispatch('updateCode2', {code: Example.Sequence});
    }
    await globals.apWrapper.initializeContext();
    this.valueSequence = this.doc.code;
    console.debug('Editor - set Editor value: ', this.value);
    this.canUserEdit = await globals.apWrapper.canUserEdit();
  },
  components: {CodeMirror}
}

</script>
