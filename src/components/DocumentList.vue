<template>
  <div class="content">
    <div class="workspace h-screen flex flex-col">
      <div class="bg-indigo-600">
        <div class="max-w-7xl mx-auto py-3 px-3 sm:px-6 lg:px-8">
          <div class="flex items-center justify-between flex-wrap">
            <div class="w-0 flex-1 flex items-center">
        <span class="flex p-2 rounded-lg bg-indigo-800">
          <!-- Heroicon name: outline/speakerphone -->
          <svg class="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
          </svg>
        </span>
              <p class="ml-3 font-medium text-white truncate">
                <span class=""> You will need to upgrade to the Full version to use this feature in the future. </span>
              </p>
            </div>
            <div class="order-3 mt-2 flex-shrink-0 w-full sm:order-2 sm:mt-0 sm:w-auto">
              <a href="https://zenuml.atlassian.net/wiki/spaces/Doc/pages/1727922177/How+to+embed+existing+macros" target="_blank" class="flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-indigo-600 bg-white hover:bg-indigo-50"> Learn more </a>
            </div>
          </div>
        </div>
      </div>
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
            <save-and-go-back-button :save-and-exit="saveAndExit" />
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
<!--                  <span class="text-sm text-gray-600">2 days ago</span>-->
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
  import EventBus from "@/EventBus";

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
      },
      saveAndExit: function () {
        return function () {
          EventBus.$emit('save')
        }
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
