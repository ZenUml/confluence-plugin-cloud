<template>
  <div class="editor">
    <div class="toolbox">
      <va-radio-group :vertical="false" v-model="diagramType">
        <va-radio-btn label="zenuml">ZenUML</va-radio-btn>
        <va-radio-btn label="mermaid">Mermaid (Beta)</va-radio-btn>
      </va-radio-group>

      <a class="help" target="_blank" :href="helpUrl">
        <va-button round type="default"><va-icon type="question-circle" /></va-button>
      </a>
    </div>
    <div class="body">
      <codemirror class="dsl-editor"
        ref="myCm"
        :code="code"
        :options="cmOptions"
        @input="onEditorCodeChange">
      </codemirror>
    </div>
  </div>

</template>

<script>
  import CodeMirror from 'vue-codemirror'
  import 'codemirror/keymap/sublime'
  // language js
  import 'codemirror/mode/javascript/javascript.js'
  import 'codemirror/addon/display/placeholder.js'
  import _ from 'lodash'

  export default {
    name: 'editor',
    data() {

      return {
        helpUrl: 'https://zenuml.atlassian.net/wiki/spaces/Doc/overview',
        cmOptions: {
          tabSize: 4,
          mode: 'text/javascript',
          theme: 'base16-dark',
          lineNumbers: true,
          line: true,
          keyMap: "sublime",
          extraKeys: {"Ctrl": "autocomplete"},
          foldGutter: true,
          gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"],
          styleSelectedText: true,
          highlightSelectionMatches: {showToken: /\w/, annotateScrollbar: true},
          placeholder: 'Write you code here'
        }
      }
    },
    methods: {
      onEditorCodeChange: _.debounce(function(newCode){
        const isMermaid = this.$store.getters.diagramType === 'mermaid';

        if(isMermaid) {
          this.$store.dispatch('updateMermaidCode', newCode)
        } else {
          this.$store.dispatch('updateCode', {code: newCode});
        }
      }, 100
    )},
    computed: {
      editor() {
        return this.$refs.myEditor.Editor
      },
      code() {
        return this.$store.getters.diagramType === 'mermaid' ? this.$store.state.mermaidCode : this.$store.state.code;
      },
      codemirror() {
        return this.$refs.myCm.codemirror
      },
      diagramType: {
        set(type) {
          this.$store.dispatch('updateDiagramType', type)
          if (type === 'zenuml') {
            this.$store.dispatch('reloadZenUML')
          }
        },
        get() {
          return this.$store.state.diagramType || 'zenuml'
        }
      },
    },
    components: {CodeMirror}
  }
</script>

<style>
  .CodeMirror pre.CodeMirror-placeholder {
    color: #777;
  }
</style>


<style scoped>
  .toolbox {
    display: flex;
    padding: 5px;
    margin: 2px 2px;
    background: #FFF;
    box-shadow: 0 2px 2px 0 rgba(0,0,0,0.14), 0 3px 1px -2px rgba(0,0,0,0.12), 0 1px 5px 0 rgba(0,0,0,0.2);
  }

  .toolbox svg {
    margin-right: 8px;
    cursor: pointer;
  }

  .toolbox .help {
    margin-left: auto;
    text-decoration: none;
  }

  .editor {
    display: flex;
    flex-direction: column;
    height: 100%;
  }

  .header, .body {
    display: flex;
    justify-content: space-between;
  }

  .body {
    height: 100%;
    min-height: 400px;
  }

  .Editor-subheader {
    background: #252526;
    height: 38px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    cursor: default;
    font-family: Lato,sans-serif;
  }

  .FilePath {
    white-space: nowrap;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    color: #777;
    padding: 0 16px;
    font-size: 13px;
  }

  .Editor-subheader .prettify-btn {
    padding: 5px;
    cursor: pointer;
    position: relative;
    text-transform: uppercase;
    font-size: 11px;
    letter-spacing: .5px;
    font-weight: 600;
    color: #fff;
    margin-right: 11px;
    opacity: .4;
  }
  .dsl-editor {
    flex: 1;
    background: red;
  }

  .dsl-editor >>> .CodeMirror {
    height: 100%;
  }

</style>