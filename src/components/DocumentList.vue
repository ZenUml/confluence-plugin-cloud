<template>
  <div class="content">
    <div class="workspace h-screen flex flex-col">
      <header class="flex flex-shrink-0">
        <div class="flex-1 flex items-center justify-between bg-white px-6">
          <nav class="flex text-sm font-medium leading-none text-slate-800">
            <a href="#" class="inline-block ml-2 px-3 py-2 hover:bg-gray-200 rounded-lg bg-gray-200" @click="setFilter('')">All</a>
            <a href="#" class="inline-block ml-2 px-3 py-2 hover:bg-gray-200 rounded-lg" @click="setFilter('sequence')">Sequence</a>
            <a href="#" class="inline-block ml-2 px-3 py-2 hover:bg-gray-200 rounded-lg" @click="setFilter('mermaid')">Mermaid</a>
            <a href="#" class="inline-block ml-2 px-3 py-2 hover:bg-gray-200 rounded-lg" @click="setFilter('graph')">Graph</a>
            <a href="#" class="inline-block ml-2 px-3 py-2 hover:bg-gray-200 rounded-lg" @click="setFilter('OpenApi')">Open API</a>
          </nav>
        </div>
        <div class="w-80 flex-shrink-0 px-4 py-3 bg-white">
          <button class="flex items-center float-right h-8 text-white text-sm font-medium">
            <save-and-go-back-button />
          </button>
        </div>

      </header>
      <div class="flex-1 flex overflow-hidden">

        <main class="flex bg-gray-200 flex-1">
          <div class="flex flex-col w-full max-w-xs flex-grow border-l border-r">
            <div class="flex flex-shrink-0 items-center px-4 py-2 justify-between border-b">
              <button class="flex items-center text-xs font-semibold text-gray-600">
                Sorted by Date
              </button>
            </div>
            <div class="flex-1 overflow-y-auto">
              <a @click="pick(diagram)" href="#" v-for="diagram in filteredDiagrams" :key="diagram.id"
                 :class="{'bg-gray-100': diagram.id === picked.id}"
                 class="block px-6 py-3 bg-white border-t hover:bg-gray-50">
                <span class="text-sm font-semibold text-gray-900">{{ diagram.title }}</span>
                <div class="flex justify-between">
                  <span class="text-sm font-semibold text-gray-500">{{ diagram.value.diagramType }}</span>
                  <span class="text-sm text-gray-600">2 days ago</span>
                </div>
                <p class="mt-2 text-sm text-gray-600">Source page: {{ diagram.container.id }}</p>
              </a>
            </div>
          </div>
          <div id="workspace-right" class="flex-grow h-full bg-white border-t">
            <iframe id='embedded-viewer' src='' width='100%' height='100%'></iframe>
          </div>
        </main>
      </div>
    </div>
  </div>
</template>

<script>
  import globals from '@/model/globals';
  import SaveAndGoBackButton from "@/components/SaveAndGoBackButton";
  import {DiagramType} from "@/model/Diagram";

  export default {
    name: 'DocumentList',
    data() {
      return {
        diagrams: [],
        picked: '',
        docTypeFilter: '',
      };
    },
    computed: {
      filteredDiagrams() {
        if (this.docTypeFilter === '') {
          return this.diagrams;
        }
        return this.diagrams.filter(diagram => diagram.value.diagramType?.toLowerCase() === this.docTypeFilter?.toLowerCase());
      }
    },
    created() {
      globals.apWrapper.listCustomContentByType(['zenuml-content-sequence', 'zenuml-content-graph']).then(d => this.diagrams = d);
    },
    methods: {
      pick(doc) {
        this.picked = doc;
        window.picked = doc;
        function getViewerUrl(diagramType) {
          if(diagramType === DiagramType.Sequence || diagramType === DiagramType.Mermaid) {
            return '/sequence-viewer.html';
          }
          if(diagramType === DiagramType.Graph) {
            return '/drawio/viewer.html';
          }
          if(diagramType === DiagramType.OpenApi) {
            return '/swagger-ui.html';
          }

          console.warn(`Unknown diagramType: ${diagramType}`);
        }

        // eslint-disable-next-line
        const iframe = document.getElementById('embedded-viewer');
        iframe.src = `${getViewerUrl(doc.value.diagramType)}${window.location.search}&rendered.for=custom-content-native&content.id=${doc.id}&embedded=true`;
      },
      setFilter(docType) {
        this.docTypeFilter = docType;
      }
    },
    components: {
      SaveAndGoBackButton,
    }
  }
</script>
