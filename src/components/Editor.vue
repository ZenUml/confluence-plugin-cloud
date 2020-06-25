<template>
  <div class="editor">
    <div class="toolbox">
      <toggle-switch
        :options="toggleOptions"
        :@change="updateMap()"
        v-model="diagramType"
        />
      <a class="help" target="_blank" :href="helpUrl">
        <svg width="20px" height="20px" viewBox="0 0 50 50" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
          <title>Help</title>
          <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
            <g id="Help">
              <circle id="Oval" stroke="#979797" fill="#D8D8D8" cx="25.5" cy="25.5" r="14.5"></circle>
              <text id="?" font-family="ArialMT, Arial" font-size="18" font-weight="normal" fill="#202020">
                <tspan x="20" y="32">?</tspan>
              </text>
            </g>
          </g>
        </svg>
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
  import ToggleSwitch from 'vuejs-toggle-switch'
  import 'codemirror/keymap/sublime'
  // language js
  import 'codemirror/mode/javascript/javascript.js'
  import 'codemirror/addon/display/placeholder.js'
  export default {
    name: 'editor',
    data() {
      return {
        diagramType: 'ZenUML',
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
        },
        toggleOptions: {
          layout: {
            color: '#007BFF',
            backgroundColor: 'white',
            borderColor: '#007BFF'
          },
          size: {
            fontSize: '1',
            height: '2',
            padding: '0.5',
            width: '100px'
          },
          items: {
            labels: [{ name: 'ZenUML', value: 'ZenUML', color: 'white', backgroundColor: '#2684FF'},
              {name: 'Mermaid', value: 'mermaid', color: 'white', backgroundColor: '#42B982'}]
          }
        }
      }
    },
    methods: {
      onEditorCodeChange(newCode) {
        const isMermaid = this.diagramType.toLowerCase() === 'mermaid';

        if(isMermaid && newCode && newCode.trim().length > 0) {
          this.$store.dispatch('updateCode', {code: ''});
          this.$store.dispatch('updateMermaidCode', newCode)
          // this.$store.state.mermaidCode = newCode
        } else {
          document.querySelector('#mermaid-diagram').innerHTML = '';

          this.$store.dispatch('updateCode', {code: newCode});
        }
      },
      updateMap() {

      }
    },
    computed: {
      editor() {
        return this.$refs.myEditor.Editor
      },
      code() {
        return this.diagramType === 'mermaid' ? this.$store.state.mermaidCode : this.$store.state.code
      },
      codemirror() {
        return this.$refs.myCm.codemirror
      }
    },
    mounted() {
      const that = this
      window.updateDiagramType = () => {
        if(that.$store.state.mermaidCode) {
          this.diagramType = 'mermaid';
          this.$store.dispatch('updateMermaidCode', that.$store.state.mermaidCode)
        }
      };
    },
    components: {CodeMirror, ToggleSwitch}
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