<template>
  <div class="editor">
    <div class="header Editor-subheader">
      <span class="prompt FilePath">Write you code here.</span>
      <a class="help-link prettify-btn" target="_blank" :href="helpUrl">Help</a>
    </div>
    <div class="body">
      <div class="toolbox">
        <img class="toolbox-item" src="https://www.websequencediagrams.com/t-signal.png" v-on:click="onToolboxClicked">
        <img class="toolbox-item" src="https://www.websequencediagrams.com/t-dotted.png" v-on:click="onToolboxClicked">
      </div>
      <codemirror class="dsl-editor"
        :code="code"
        :options="cmOptions"
        @input="onEditorCodeChange">
      </codemirror>
    </div>
  </div>

</template>

<script>
  import 'codemirror/keymap/sublime'
  import 'codemirror/lib/codemirror.css'
  // language js
  import 'codemirror/mode/javascript/javascript.js'
  // theme css
  import 'codemirror/theme/base16-dark.css'
  export default {
    name: 'editor',
    data() {
      return {
        helpUrl: 'https://www.zenuml.com/ZenUML_Sequence_Diagram_addon_help.html',
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
          highlightSelectionMatches: {showToken: /\w/, annotateScrollbar: true}
        }
      }
    },
    methods: {
      onEditorCodeChange(newCode) {
        this.$store.dispatch('updateCode', {code: newCode})
      },
      
      onToolboxClicked(newCode) {
        this.$store.dispatch('updateCode', {code: this.$store.state.code + '\nA->B:text'})
      }
    },
    computed: {
      editor() {
        return this.$refs.myEditor.Editor
      },
      code() {
        return this.$store.state.code
      }
    }
  }
</script>

<style scoped>
  .editor, .toolbox {
    display: flex;
    flex-direction: column;
    height: 100%;
  }

  .toolbox {
    margin-top: 2px;
    margin-right: 10px;
  }

  .toolbox-item {
    margin-bottom: 2px;
  }

  .header, .body {
    display: flex;
    justify-content: space-between;
  }

  .body {
    height: 100%;
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