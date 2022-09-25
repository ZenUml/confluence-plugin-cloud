<template>
  <header class="toolbar header border-b border-gray-800 p-2 flex items-center justify-between">
    <div class="inline-block group ml-2 p-0.5 rounded flex bg-gray-100 hover:bg-gray-200">
      <button type="button"
              ref = "btn-sequence"
              class="flex focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2 rounded focus:outline-none focus-visible:ring-offset-gray-100"
              :class="diagramType === 'sequence' ? 'bg-white shadow-sm ring-1 ring-black ring-opacity-5' : ''"
              @click="setActiveTab('sequence')"
              :tabindex="diagramType === 'sequence' ? '0' : '-1'">
          <span class="p-1 lg:pl-2.5 lg:pr-3.5 rounded flex items-center text-sm font-medium"
                :class="diagramType === 'sequence' ? 'bg-white shadow-sm ring-1 ring-black ring-opacity-5' : ''">
            <span class="sr-only lg:not-sr-only text-gray-600 group-hover:text-gray-900"
                  :class="diagramType === 'sequence' ? 'text-gray-900' : 'text-gray-600 group-hover:text-gray-900'">Sequence</span>
          </span>
      </button>
      <button type="button"
              ref = "btn-mermaid"
              class="ml-0.5 p-1 lg:pl-2.5 lg:pr-3.5 rounded flex items-center text-sm text-gray-600 font-medium focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2 focus:outline-none focus-visible:ring-offset-gray-100"
              :class="diagramType === 'mermaid' ? 'bg-white shadow-sm ring-1 ring-black ring-opacity-5' : ''"
              @click="setActiveTab('mermaid')">
        <span class="sr-only lg:not-sr-only text-gray-900"
            :class="diagramType === 'mermaid' ? 'text-gray-900' : 'text-gray-600 group-hover:text-gray-900'">Mermaid</span>
      </button>
    </div>
    <div class="inline-block flex items-center">
      <div class="inline-block ml-2">
        <send-feedback class="ml-2"/>
      </div>
      <a class="inline-block help mx-1 ml-2" target="_blank" :href="helpUrl">
        <button class="flex items-center bg-gray-100 px-2 py-1 text-gray-600 text-sm font-semibold rounded" @click="saveAndExit">
          <span>
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          </span>
          <span>Help</span>
        </button>

      </a>
      <div class="inline-block ml-2">
        <save-and-go-back-button class="ml-2" :saveAndExit="saveAndExit"/>
      </div>
    </div>
  </header>
</template>

<script>
import {mapState, mapMutations} from 'vuex';
import SaveAndGoBackButton from "@/components/SaveAndGoBackButton";
import {DiagramType} from "@/model/Diagram/Diagram";
import SendFeedback from "@/components/SendFeedback";
import EventBus from "@/EventBus";
export default {
  name: "Header",
  components: {
    SendFeedback,
    SaveAndGoBackButton,
  },
  data() {
    return {
      helpUrl: 'https://zenuml.atlassian.net/wiki/spaces/Doc/overview',
    }
  },
  computed: {
    ...mapState(['code', 'styles', 'mermaidCode', 'diagramType']),
    saveAndExit: function () {
      return function () {
        EventBus.$emit('save')
      }
    }
  },
  methods: {
    ...mapMutations(['updateDiagramType']),
    setActiveTab(tab) {
      let type = tab === 'sequence' ? DiagramType.Sequence : DiagramType.Mermaid;
      this.updateDiagramType(type);
      if (type === DiagramType.Sequence) {
        this.$store.dispatch('reloadZenUML')
      }
    },
  }
}
</script>