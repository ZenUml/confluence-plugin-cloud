<template>
  <div class="content">
    <Header />
    <div class="workspace">
      <div>Select a diagram to embed:</div>
      <div v-for="diagram in diagrams" :key="diagram.id">
        <input type="radio" v-model="picked" :value="diagram">
          title: {{ diagram.title }}, type: {{ diagram.value.diagramType }}, container: {{ diagram.container.id }}
      </div>
    </div>
  </div>
</template>

<script>
  import Header from "@/components/Header";
  import globals from '@/model/globals';

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
    watch: {
      picked: function(value) {
        // eslint-disable-next-line
        window.picked = value;
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
