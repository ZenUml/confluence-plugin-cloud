<template>
  <div class="toolbar header">
    <div class="group p-0.5 rounded-lg flex bg-gray-100 hover:bg-gray-200">
      <button type="button"
              class="flex focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2 rounded-md focus:outline-none focus-visible:ring-offset-gray-100"
              :class="activeTab === 'sequence' ? 'bg-white shadow-sm ring-1 ring-black ring-opacity-5' : ''"
              @click="setActiveTab('sequence')"
              :tabindex="activeTab === 'sequence' ? '0' : '-1'">
          <span class="p-1.5 lg:pl-2.5 lg:pr-3.5 rounded-md flex items-center text-sm font-medium"
                :class="activeTab === 'sequence' ? 'bg-white shadow-sm ring-1 ring-black ring-opacity-5' : ''">
            <span class="sr-only lg:not-sr-only text-gray-600 group-hover:text-gray-900"
                  :class="activeTab === 'sequence' ? 'text-gray-900' : 'text-gray-600 group-hover:text-gray-900'">Sequence</span>
          </span>
      </button>
      <button type="button"
              class="ml-0.5 p-1.5 lg:pl-2.5 lg:pr-3.5 rounded-md flex items-center text-sm text-gray-600 font-medium focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2 focus:outline-none focus-visible:ring-offset-gray-100"
              :class="activeTab === 'mermaid' ? 'bg-white shadow-sm ring-1 ring-black ring-opacity-5' : ''"
              @click="setActiveTab('mermaid')">
      <span class="sr-only lg:not-sr-only text-gray-900"
            :class="activeTab === 'mermaid' ? 'text-gray-900' : 'text-gray-600 group-hover:text-gray-900'">Mermaid</span>
      </button>
    </div>
    <a class="help mx-1" target="_blank" :href="helpUrl">
      <va-button type="default"><va-icon type="question-circle" /><span class="ml-1">Help</span></va-button>
    </a>
    <send-feedback/>
    <save-and-go-back-button :save-and-exit="saveAndExit"/>
  </div>
</template>

<script>
import {mapState} from 'vuex';
import SaveAndGoBackButton from "@/components/SaveAndGoBackButton";
import {DiagramType} from "@/model/Diagram";
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
      activeTab: 'sequence',
      helpUrl: 'https://zenuml.atlassian.net/wiki/spaces/Doc/overview',
    }
  },
  mounted() {
    // read diagram type from store and set active tab
    const diagramType = this.$store.state.diagramType;
    if (diagramType?.toLowerCase() === DiagramType.Mermaid?.toLowerCase()) {
      this.setActiveTab('mermaid');
    } else {
      this.setActiveTab('sequence');
    }
  },
  computed: {
    ...mapState(['code', 'styles', 'mermaidCode', 'diagramType']),
    diagramType: {
      set(type) {
        this.$store.dispatch('updateDiagramType', type)
        if (type === DiagramType.Sequence) {
          this.$store.dispatch('reloadZenUML')
        }
      },
      get() {
        return this.$store.state.diagramType || DiagramType.Sequence
      }
    },
    saveAndExit: function () {
      return function () {
        EventBus.$emit('save')
      }
    }
  },
  methods: {
    setActiveTab(tab) {
      this.activeTab = tab;
      let type = tab === 'sequence' ? DiagramType.Sequence : DiagramType.Mermaid;
      console.log(type);
      this.$store.dispatch('updateDiagramType', type)
      if (type === DiagramType.Sequence) {
        this.$store.dispatch('reloadZenUML')
      }
    },
  }
}
</script>

<style scoped>
.header {
  display: flex;
  padding: 5px;
  background: #FFF;
  box-shadow: 0 2px 2px 0 rgba(0,0,0,0.14), 0 3px 1px -2px rgba(0,0,0,0.12), 0 1px 5px 0 rgba(0,0,0,0.2);
}

.header svg {
  margin-right: 8px;
  cursor: pointer;
}

.header .save-and-exit {
  margin-left: auto;
  text-decoration: none;
}
</style>
<style>
.view .toolbar.header {
  visibility: hidden;
}
</style>