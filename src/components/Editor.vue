<template>
  <div class="editor">
    <div class="header Editor-subheader">
      <span class="prompt FilePath">Write you code here.</span>
      <a class="help-link prettify-btn" target="_blank" :href="helpUrl">Help</a>
    </div>
    <div class="toolbox">
      <svg v-on:click="addParticipant()"
         width="20px" height="20px" viewBox="0 0 50 50" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
        <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
          <g id="Participant-Copy" stroke="#202020">
            <rect id="Rectangle" x="8.5" y="4.5" width="34" height="10" rx="3"></rect>
            <path d="M25.5,15 L25.5,47.5" id="Line" stroke-linecap="square" stroke-dasharray="5"></path>
          </g>
        </g>
      </svg>
      <svg v-on:click="appendCode('A->B:message')"
           width="20px" height="20px" viewBox="0 0 50 50" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
        <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
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
      <svg width="20px" height="20px" viewBox="0 0 50 50" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
        <!-- Generator: Sketch 52.5 (67469) - http://www.bohemiancoding.com/sketch -->
        <title>Execution Copy 3</title>
        <desc>Created with Sketch.</desc>
        <g id="Execution-Copy-3" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
          <path d="M20.5,4 L20.5,46" id="Line" stroke="#202020" stroke-linecap="square" stroke-dasharray="5"></path>
          <g id="Group-3" transform="translate(21.000000, 14.000000)">
            <g id="Group-2">
              <g id="Group" stroke="#202020" stroke-linecap="square" stroke-width="2">
                <path d="M0.5,1 L19,1" id="Line-2"></path>
                <path d="M19,12 L19,1" id="Line-2"></path>
              </g>
              <g id="Group" transform="translate(9.500000, 12.000000) rotate(-180.000000) translate(-9.500000, -12.000000) translate(4.000000, 5.000000)">
                <path d="M6.97368421,0.725839752 L12.5869926,12.0263158 L1.36037585,12.0263158 L6.97368421,0.725839752 Z" id="Triangle" stroke="#202020" stroke-width="2" transform="translate(6.973684, 7.000000) rotate(90.000000) translate(-6.973684, -7.000000) "></path>
                <path d="M6.97368421,0.725839752 L12.5869926,12.0263158 L1.36037585,12.0263158 L6.97368421,0.725839752 Z" id="Triangle-Copy" stroke="#202020" stroke-width="2" transform="translate(6.973684, 7.000000) rotate(90.000000) translate(-6.973684, -7.000000) "></path>
                <rect id="Rectangle" fill="#FFFFFF" x="0" y="0" width="3" height="6"></rect>
                <rect id="Rectangle" fill="#FFFFFF" x="0" y="8" width="3" height="6"></rect>
              </g>
            </g>
            <path d="M3,12 L18,12" id="Line-2" stroke="#202020" stroke-width="2" stroke-linecap="square" transform="translate(10.500000, 12.000000) rotate(-180.000000) translate(-10.500000, -12.000000) "></path>
          </g>
        </g>
      </svg>

      <svg v-on:click="appendCode('A.message {\n}')"
        width="20px" height="20px" viewBox="0 0 50 50" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
        <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
          <g id="Execution-Copy" stroke="#202020">
            <path d="M40.5,5 L40.5,47" id="Line" stroke-linecap="square" stroke-dasharray="5"></path>
            <rect id="Rectangle" fill="#FFFFFF" x="37.5" y="20.5" width="6" height="13"></rect>
            <path d="M11.6315789,20 L34.3684211,20" id="Line-2" stroke-width="2" stroke-linecap="square"></path>
            <polygon id="Triangle" stroke-width="2" fill="#202020" transform="translate(32.473684, 20.000000) rotate(90.000000) translate(-32.473684, -20.000000) " points="32.4736842 15.4736842 36.4736842 24.5263158 28.4736842 24.5263158"></polygon>
            <path d="M9.5,5 L9.5,47" id="Line" stroke-linecap="square" stroke-dasharray="5"></path>
          </g>
        </g>
      </svg>
      <svg width="20px" height="20px" viewBox="0 0 50 50" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
        <!-- Generator: Sketch 52.5 (67469) - http://www.bohemiancoding.com/sketch -->
        <title>Execution Copy 4</title>
        <desc>Created with Sketch.</desc>
        <g id="Execution-Copy-4" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
          <path d="M40.5,5 L40.5,47" id="Line" stroke="#202020" stroke-linecap="square" stroke-dasharray="5"></path>
          <rect id="Rectangle" stroke="#202020" fill="#FFFFFF" x="37.5" y="20.5" width="6" height="13"></rect>
          <path d="M11.6315789,20 L34.3684211,20" id="Line-2" stroke="#202020" stroke-width="2" stroke-linecap="square"></path>
          <polygon id="Triangle" stroke="#202020" stroke-width="2" fill="#202020" transform="translate(32.473684, 20.000000) rotate(90.000000) translate(-32.473684, -20.000000) " points="32.4736842 15.4736842 36.4736842 24.5263158 28.4736842 24.5263158"></polygon>
          <path d="M9.5,5 L9.5,47" id="Line" stroke="#202020" stroke-linecap="square" stroke-dasharray="5"></path>
          <path d="M36.5,34 L17.0526316,34" id="Line" stroke="#202020" stroke-width="2" stroke-linecap="square" stroke-dasharray="3"></path>
          <path d="M11.5,34 L18,34" id="Line-2-Copy" stroke="#202020" stroke-width="2" stroke-linecap="square" transform="translate(15.000000, 34.000000) rotate(-180.000000) translate(-15.000000, -34.000000) "></path>
          <g id="Group-Copy" transform="translate(19.500000, 34.000000) rotate(-180.000000) translate(-19.500000, -34.000000) translate(14.000000, 27.000000)">
            <path d="M6.97368421,0.725839752 L12.5869926,12.0263158 L1.36037585,12.0263158 L6.97368421,0.725839752 Z" id="Triangle" stroke="#202020" stroke-width="2" transform="translate(6.973684, 7.000000) rotate(90.000000) translate(-6.973684, -7.000000) "></path>
            <path d="M6.97368421,0.725839752 L12.5869926,12.0263158 L1.36037585,12.0263158 L6.97368421,0.725839752 Z" id="Triangle-Copy" stroke="#202020" stroke-width="2" transform="translate(6.973684, 7.000000) rotate(90.000000) translate(-6.973684, -7.000000) "></path>
            <rect id="Rectangle" fill="#FFFFFF" x="0" y="0" width="3" height="6"></rect>
            <rect id="Rectangle" fill="#FFFFFF" x="0" y="8" width="3" height="6"></rect>
          </g>
        </g>
      </svg>
      <svg width="20px" height="20px" viewBox="0 0 50 50" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
        <title>Self sync message</title>
        <g id="Execution-Copy-2" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
          <path d="M20.5,4 L20.5,46" id="Line" stroke="#202020" stroke-linecap="square" stroke-dasharray="5"></path>
          <rect id="Rectangle" stroke="#202020" fill="#FFFFFF" x="17.5" y="24.5" width="6" height="13"></rect>
          <g id="Group-2" transform="translate(20.000000, 12.000000)" stroke="#202020" stroke-width="2">
            <g id="Group">
              <path d="M1,1 L23,1" id="Line-2" stroke-linecap="square"></path>
              <path d="M17.0526316,12.5 L22.5,12.5" id="Line-2" stroke-linecap="square"></path>
              <path d="M23,12 L23,1" id="Line-2" stroke-linecap="square"></path>
              <polygon id="Triangle" fill="#202020" transform="translate(10.526316, 12.000000) rotate(270.000000) translate(-10.526316, -12.000000) " points="10.5263158 7.47368421 14.5263158 16.5263158 6.52631579 16.5263158"></polygon>
            </g>
          </g>
        </g>
      </svg>

      <svg v-on:click="appendCode('a = new A()')"
        width="20px" height="20px" viewBox="0 0 50 50" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
        <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
          <g id="Creation-Copy">
            <path d="M40.5,32 L40.5,49" id="Line" stroke="#202020" stroke-linecap="square" stroke-dasharray="5"></path>
            <path d="M11.6315789,26 L29,26" id="Line-2" stroke="#202020" stroke-width="2" fill="#202020" stroke-linecap="square"></path>
            <polygon id="Triangle" stroke="#202020" stroke-width="2" fill="#202020" transform="translate(28.526316, 26.000000) rotate(90.000000) translate(-28.526316, -26.000000) " points="28.5263158 21.4736842 32.5263158 30.5263158 24.5263158 30.5263158"></polygon>
            <path d="M9.5,5 L9.5,47" id="Line" stroke="#202020" stroke-linecap="square" stroke-dasharray="5"></path>
            <rect id="Rectangle" stroke="#202020" x="35.5" y="20.5" width="10" height="10" rx="3"></rect>
            <text id="C" font-family="LucidaConsole, Lucida Console" font-size="18" font-weight="normal" fill="#202020">
              <tspan x="11.6315789" y="24">C</tspan>
            </text>
          </g>
        </g>
      </svg>

      <svg v-on:click="appendCode('if(condition) {\n\t A.method()\n}\n')"
         width="20px" height="20px" viewBox="0 0 50 50" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
        <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
          <g id="Alt-Copy">
            <rect id="Rectangle" stroke="#202020" x="4.5" y="8.5" width="41" height="35"></rect>
            <path d="M5.57147686,20.9013672 L22,21" id="Line-3" stroke="#202020" stroke-linecap="square"></path>
            <text id="Alt" font-family="Arial-Black, Arial Black" font-size="14" font-weight="700" fill="#202020">
              <tspan x="14" y="37">Alt</tspan>
            </text>
            <path d="M25.5,15.2006836 L22.1101562,20.9013672" id="Line-3" stroke="#202020" stroke-linecap="square"></path>
            <path d="M25.5,15.2006836 L25.5,9" id="Line-4" stroke="#202020" stroke-linecap="square"></path>
          </g>
        </g>
      </svg>

      <svg v-on:click="appendCode('while(condition) {\n\t A.method()\n}\n')"
         width="20px" height="20px" viewBox="0 0 50 50" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
        <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
          <g id="Loop-Copy">
            <rect id="Rectangle" stroke="#202020" x="4.5" y="8.5" width="41" height="35"></rect>
            <path d="M5.57147686,20.9013672 L22,21" id="Line-3" stroke="#202020" stroke-linecap="square"></path>
            <text id="Loop" font-family="Arial-Black, Arial Black" font-size="14" font-weight="700" fill="#202020">
              <tspan x="6" y="37">Loop</tspan>
            </text>
            <path d="M25.5,15.2006836 L22.1101562,20.9013672" id="Line-3" stroke="#202020" stroke-linecap="square"></path>
            <path d="M25.5,15.2006836 L25.5,9" id="Line-4" stroke="#202020" stroke-linecap="square"></path>
          </g>
        </g>
      </svg>

      <svg v-on:click="appendCode('//Note')"
         width="20px" height="20px" viewBox="0 0 50 50" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
        <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
          <g id="Note-Copy">
            <path d="M7.625,15 L2.375,30.5" id="Line" stroke="#202020" stroke-linecap="square"></path>
            <path d="M10.625,15 L5,31" id="Line" stroke="#202020" stroke-linecap="square"></path>
            <text id="Note" font-family="Arial-ItalicMT, Arial" font-size="18" font-style="italic" font-weight="normal" fill="#202020">
              <tspan x="9" y="30">Note</tspan>
            </text>
          </g>
        </g>
      </svg>

      <svg class="help" width="20px" height="20px" viewBox="0 0 50 50" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
        <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
          <g id="Help">
            <circle id="Oval" stroke="#979797" fill="#D8D8D8" cx="25.5" cy="25.5" r="14.5"></circle>
            <text id="?" font-family="ArialMT, Arial" font-size="18" font-weight="normal" fill="#202020">
              <tspan x="20" y="32">?</tspan>
            </text>
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
      appendCode(code) {
        this.$store.dispatch('updateCode', {code: this.$store.state.code + `\n${code}`});
      },
      addParticipant() {
        let code = this.$store.state.code;
        let lines = code.split('\n');
        let buffer = '', added = false;
        lines.forEach(line => {
          if(!added && (line.trim().length > 0 && !line.trim().startsWith('//'))) {
            buffer = `${buffer}\nNewParticipant`;
            added = true;
          }
          buffer = `${buffer}\n${line}`;
        });
        if(!added) {
          buffer = `${code}\nNewParticipant`;
        }
        this.$store.dispatch('updateCode', {code: buffer});
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

  .toolbox svg.help {
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