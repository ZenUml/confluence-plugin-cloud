<template>
  <div class="editor">
    <div class="header Editor-subheader">
      <span class="prompt FilePath">Write you code here.</span>
      <a class="help-link prettify-btn" target="_blank" :href="helpUrl">Help</a>
    </div>
    <div class="toolbox button waves-effect">

      <svg v-on:click="onToolboxClicked"
           width="20px" height="20px" viewBox="0 0 50 50" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
        <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
          <g id="Message-Copy">
            <path d="M40.5,5 L40.5,47" id="Line" stroke="#202020" stroke-linecap="square" stroke-dasharray="5"></path>
            <path d="M11.6315789,20 L37,20" id="Line-2" stroke="#202020" stroke-width="2" stroke-linecap="square"></path>
            <path d="M31.9736842,13.7258398 L37.5869926,25.0263158 L26.3603759,25.0263158 L31.9736842,13.7258398 Z" id="Triangle" stroke="#202020" stroke-width="2" transform="translate(31.973684, 20.000000) rotate(90.000000) translate(-31.973684, -20.000000) "></path>
            <path d="M9.5,5 L9.5,47" id="Line" stroke="#202020" stroke-linecap="square" stroke-dasharray="5"></path>
            <rect id="Rectangle" fill="#FFFFFF" x="25" y="13" width="3" height="6"></rect>
            <rect id="Rectangle" fill="#FFFFFF" x="25" y="21" width="3" height="6"></rect>
          </g>
        </g>
      </svg>


      <svg v-on:click="onToolboxClicked"
        width="20px" height="20px" viewBox="0 0 50 50" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
        <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
          <g id="Execution-Copy" stroke="#202020">
            <path d="M40.5,5 L40.5,47" id="Line" stroke-linecap="square" stroke-dasharray="5"></path>
            <rect id="Rectangle" fill="#FFFFFF" x="37.5" y="20.5" width="6" height="13"></rect>
            <path d="M11.6315789,20 L34.3684211,20" id="Line-2" stroke-width="2" stroke-linecap="square"></path>
            <polygon id="Triangle" stroke-width="2" fill="#202020" transform="translate(32.473684, 20.000000) rotate(90.000000) translate(-32.473684, -20.000000) " points="32.4736842 15.4736842 36.4736842 24.5263158 28.4736842 24.5263158"></polygon>
            <path d="M9.5,5 L9.5,47" id="Line" stroke-linecap="square" stroke-dasharray="5"></path>
          </g>
        </g>
      </svg>
    </div>
    <div class="body">
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


  .toolbox.button{
    display: inline-block;
    height: 22px;
    padding: 5px;
    margin: 2px 2px;
    background: #FFF;
    box-shadow: 0 2px 2px 0 rgba(0,0,0,0.14), 0 3px 1px -2px rgba(0,0,0,0.12), 0 1px 5px 0 rgba(0,0,0,0.2);
    transition: all 0.3s;
    border-radius: 3px;
  }

  .toolbox.waves-effect {
    position: relative;
    cursor: pointer;
    display: inline-block;
    overflow: hidden;
    user-select: none;
    transition: .3s ease-out;
  }

  .toolbox svg {
    padding-right: 15px;
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