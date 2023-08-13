<template>
  <code-mirror v-model="value" ref="myCm"
               basic
               :dark="dark"
               :lang="cmOptions.language"
               @change="onEditorCodeChange" />
</template>

<script>
import {mapState} from 'vuex';

import _ from 'lodash'

import CodeMirror from 'vue-codemirror6';
import { javascript } from '@codemirror/lang-javascript';
import '@codemirror/autocomplete';

import EventBus from '@/EventBus'
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
      value: '',
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
  methods: {
    onEditorCodeChange: function (newCode) {
      console.debug('onEditorCodeChange', newCode.doc.toString());
      const isMermaid = this.diagramType === 'mermaid';
      this.$store.commit('updateCode2', newCode.doc.toString());
      if (isMermaid) {
        this.$store.dispatch('updateMermaidCode', newCode.doc.toString());
      } else {
        this.$store.dispatch('updateCode', {code: newCode.doc.toString()});
      }
    },
  },
  computed: {
    ...mapState(['diagramType']),
    code() {
      return this.diagramType === DiagramType.Mermaid? this.doc.mermaidCode || Example.Mermaid : this.doc.code || Example.Sequence;
    },
    codemirror() {
      return this.$refs.myCm.codemirror
    },
  },
  async created() {
    const compositeContentProvider = defaultContentProvider(new ApWrapper2(AP));
    const {doc} = await compositeContentProvider.load();
    this.doc = doc;
    if (doc === NULL_DIAGRAM) {
      this.doc ={
        diagramType: DiagramType.Sequence,
        code: Example.Sequence
      }
      this.$store.dispatch('updateCode', {code: Example.Sequence});
    }
    await globals.apWrapper.initializeContext();
    this.canUserEdit = await globals.apWrapper.canUserEdit();
  },
  mounted() {
    const that = this
    EventBus.$on('highlight', (codeRange) => {
      if(that.mark) {
        that.mark.clear()
      }
      that.mark = that.codemirror.markText({
        line: codeRange.start.line-1, ch: codeRange.start.col
      }, {
        line: codeRange.stop.line-1, ch: codeRange.stop.col
      }, {css: 'background: gray'})
    })
    this.codemirror?.on('cursorActivity',_.debounce(() => {
      if (this.mark) {
        this.mark.clear()
      }
      const cursor = that.codemirror.getCursor();
      const line = cursor.line;
      let pos = cursor.ch;

      for (let i = 0; i < line; i++) {
        pos += that.codemirror.getLine(i).length + 1
      }
      that.$store.state.cursor = pos
    }, 500))

  },
  components: {CodeMirror}
}

</script>
