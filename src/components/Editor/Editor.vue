<template>
  <div class="flex flex-col h-full">
    <div class="flex flex-col h-full justify-between">
      <codemirror class="dsl-editor flex flex-1"
        ref="myCm"
        :code="code"
        :options="cmOptions"
        @input="onEditorCodeChange">
      </codemirror>
    </div>
  </div>

</template>

<script>
  import {mapState} from 'vuex';

  import _ from 'lodash'
  import { codemirror } from 'vue-codemirror'
  import 'codemirror/keymap/sublime'
  // language js
  import 'codemirror/mode/javascript/javascript.js'
  import 'codemirror/addon/display/placeholder.js'
  import 'codemirror/addon/edit/closebrackets.js'
  // Code Editor style
  import 'codemirror/lib/codemirror.css'
  // theme css
  import 'codemirror/theme/base16-dark.css'

  import EventBus from '@/EventBus'
  import defaultContentProvider from "@/model/ContentProvider/CompositeContentProvider";
  import AP from "@/model/AP";
  import globals from "@/model/globals";
  import {DiagramType, NULL_DIAGRAM} from "@/model/Diagram/Diagram";
  import Example from "@/utils/sequence/Example";
  import ApWrapper2 from "@/model/ApWrapper2";

  export default {
    name: 'editor',
    data() {
      return {
        doc: NULL_DIAGRAM,
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
      onEditorCodeChange: function (newCode) {
        const isMermaid = this.diagramType === 'mermaid';

        if (isMermaid) {
          this.$store.dispatch('updateMermaidCode', newCode);
        } else {
          this.$store.dispatch('updateCode', {code: newCode});
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
    components: {codemirror}
  }
</script>

<style>
  @import "~codemirror/lib/codemirror.css";
  @import "~codemirror/theme/monokai.css";

  .CodeMirror {
    font-family: Menlo, 'Fira Code', Monaco, source-code-pro, "Ubuntu Mono", "DejaVu sans mono", Consolas, monospace;
    font-size: 16px;
    height: 100%;
    width: 100%;
  }

</style>
