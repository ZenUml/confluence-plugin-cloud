<template>
  <div class="content">
    <Header />
    <div class="workspace">
      <div id="workspace-left" class="split editor">
        <div>Select a diagram to embed:</div>
        <div v-for="diagram in diagrams" :key="diagram.id">
          <input type="radio" v-model="picked" :value="diagram">
            title: {{ diagram.title }}, type: {{ diagram.value.diagramType }}, container: {{ diagram.container.id }}
        </div>
      </div>
      <div id="workspace-right" class="split diagram">
        <iframe id='embedded-viewer' src='' width='100%' height='100%'></iframe>
      </div>
    </div>
  </div>
</template>

<script>
  import Header from "@/components/Header";
  import globals from '@/model/globals';
  import {DiagramType} from "@/model/Diagram";
  import Split from 'split.js'

  export default {
    name: 'DiagramList',
    data() {
      return {
        diagrams: [],
        picked: ''
      };
    },
    created() {
      globals.apWrapper.listCustomContentByType(['zenuml-content-sequence', 'zenuml-content-graph']).then(d => this.diagrams = d);
    },
    mounted () {
      if (window.split) {
        Split(['#workspace-left', '#workspace-right'], { sizes: [35, 65]})
      }
    },
    watch: {
      picked: function(value) {
        // eslint-disable-next-line
        window.picked = value;

        console.debug('picked value:', value);

        function getViewerUrl(diagramType) {
          if(diagramType == DiagramType.Sequence || diagramType == DiagramType.Mermaid) {
            return '/sequence-viewer.html';
          }
          if(diagramType == DiagramType.Graph) {
            return '/drawio/viewer.html';
          }
          if(diagramType == DiagramType.OpenApi) {
            return '/swagger-ui.html';
          }

          console.warn(`Unknown diagramType: ${diagramType}`);
        }

        // eslint-disable-next-line
        const iframe = document.getElementById('embedded-viewer');
        iframe.src = `${getViewerUrl(value.value.diagramType)}${window.location.search}&rendered.for=custom-content-native&content.id=${value.id}&embedded=true`;
      }
    },
    components: {
      Header
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>

.content {
  height: 100%;
}

.workspace {
  height: calc(100% - 50px);
  margin-top: 5px;
}

</style>
