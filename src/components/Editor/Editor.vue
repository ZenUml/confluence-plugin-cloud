<template>
  <div class="flex flex-col h-full">
    <div class="flex flex-col h-full justify-between">
      <div class="dsl-editor flex flex-1">
        <textarea ref="htmlEditor"></textarea>
      </div>
    </div>
  </div>

</template>

<script>
import {mapState} from 'vuex';

import _ from 'lodash'
import 'codemirror/keymap/sublime'
// language js
import 'codemirror/mode/javascript/javascript.js'
import 'codemirror/addon/display/placeholder.js'
import 'codemirror/addon/edit/closebrackets.js'
import EventBus from '@/EventBus'
import globals from "@/model/globals";
import {DiagramType} from "@/model/Diagram/Diagram";
import codemirror from "codemirror";

let cmEditor

export default {
  name: 'editor',
  data() {
    return {
      cmOptions: {
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
    initEditor: function (options){
      cmEditor = codemirror.fromTextArea(this.$refs.htmlEditor, options);
    },
    onEditorCodeChange: function (newCode) {
      const isMermaid = this.diagramType === 'mermaid';

      if (isMermaid) {
        this.$store.dispatch('updateMermaidCode', newCode);
      } else {
        // TODO: rename the action updateCode2
        this.$store.dispatch('updateCode2', newCode);
      }
    },
  },
  computed: {
    ...mapState({
      diagramType: state => state.diagram.diagramType,
    }),
    code() {
      return this.diagramType === DiagramType.Mermaid ? this.$store.state.diagram.mermaidCode : this.$store.state.diagram.code;
    },
    codemirror() {
      return this.$refs.myCm.codemirror
    },
  },
  watch: {
    diagramType(){
      cmEditor.setValue(this.code)
    }
  },
  async created() {
    this.canUserEdit = await globals.apWrapper.canUserEdit();
  },
  mounted() {
    const that = this
    this.initEditor(this.cmOptions);
    EventBus.$on('highlight', (codeRange) => {
      if(that.mark) {
        that.mark.clear()
      }
      that.mark = cmEditor.markText({
        line: codeRange.start.line-1, ch: codeRange.start.col
      }, {
        line: codeRange.stop.line-1, ch: codeRange.stop.col
      }, {css: 'background: gray'})
    })
    cmEditor.setValue(this.code)
    cmEditor.on('change', _.debounce((instance) => {
      this.onEditorCodeChange(instance.getValue())
    }, 500))
    cmEditor?.on('cursorActivity',_.debounce(() => {
      if (this.mark) {
        this.mark.clear()
      }
      const cursor = cmEditor.getCursor();
      const line = cursor.line;
      let pos = cursor.ch;

      for (let i = 0; i < line; i++) {
        pos += cmEditor.getLine(i).length + 1
      }
      that.$store.state.cursor = pos
    }, 500))

  }
}
</script>
<style>
@import 'codemirror/lib/codemirror.css';
@import 'codemirror/theme/base16-dark.css';
@import "codemirror/theme/monokai.css";

.CodeMirror {
  font-family: Menlo, 'Fira Code', Monaco, source-code-pro, "Ubuntu Mono", "DejaVu sans mono", Consolas, monospace;
  font-size: 16px;
  height: 100%!important;
  width: 100%;
}
</style>
