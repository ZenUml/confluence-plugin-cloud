<template>
  <div class="content">
    <div class="workspace h-screen flex flex-col">
      <header class="flex flex-shrink-0">
        <div class="flex-1 flex items-center justify-between bg-white px-6">
          <nav class="flex">
            <a href="#" class="inline-block leading-none ml-2 px-3 py-2 hover:bg-gray-200 bg-gray-200 rounded-lg text-sm font-medium text-slate-800">All</a>
            <a href="#" class="inline-block leading-none ml-2 px-3 py-2 hover:bg-gray-200 rounded-lg text-sm font-medium text-slate-800">Sequence</a>
            <a href="#" class="inline-block leading-none ml-2 px-3 py-2 hover:bg-gray-200 rounded-lg text-sm font-medium text-slate-800">Mermaid</a>
            <a href="#" class="inline-block leading-none ml-2 px-3 py-2 hover:bg-gray-200 rounded-lg text-sm font-medium text-slate-800">Graph</a>
            <a href="#" class="inline-block leading-none ml-2 px-3 py-2 hover:bg-gray-200 rounded-lg text-sm font-medium text-slate-800">Open API</a>
          </nav>
          <div class="flex items-center">
            <span class="relative py-1 w-64">
              <span class="absolute inset-y-0 left-0 flex items-center pl-2  ">
                <svg class="h-5 w-5 fill-current text-gray-500" xmlns="http://www.w3.org/2000/svg"
                     viewBox="0 0 302.967 302.967" xml:space="preserve">
                  <path d="M151.483 302.967C67.956 302.967 0 235.017 0 151.483S67.956 0 151.483 0s151.483 67.956 151.483 151.483-67.949 151.484-151.483 151.484zm0-278.551c-70.066 0-127.067 57.001-127.067 127.067S81.417 278.55 151.483 278.55 278.55 221.549 278.55 151.483 221.555 24.416 151.483 24.416z"/>
                  <path d="M116.586 118.12c1.795-4.607 4.297-8.588 7.511-11.961 3.225-3.389 7.114-6.016 11.667-7.898 4.547-1.904 9.633-2.845 15.262-2.845 7.261 0 13.32.995 18.183 2.997 4.857 1.996 8.768 4.482 11.738 7.441 2.964 2.97 5.091 6.168 6.369 9.584 1.273 3.432 1.915 6.636 1.915 9.595 0 4.901-.642 8.947-1.915 12.118-1.278 3.171-2.866 5.88-4.759 8.131-1.898 2.252-3.987 4.172-6.293 5.755a147.159 147.159 0 0 0-6.516 4.759 30.34 30.34 0 0 0-5.445 5.439c-1.588 2.04-2.589 4.601-2.991 7.664v5.831H140.6v-6.908c.305-4.395 1.153-8.072 2.529-11.036 1.382-2.964 2.991-5.499 4.83-7.598 1.844-2.089 3.786-3.911 5.836-5.445a105.25 105.25 0 0 0 5.673-4.591c1.73-1.545 3.144-3.225 4.221-5.069 1.071-1.833 1.556-4.15 1.452-6.908 0-4.705-1.148-8.18-3.454-10.427-2.295-2.257-5.493-3.378-9.589-3.378-2.758 0-5.134.533-7.131 1.605s-3.628 2.513-4.911 4.302c-1.278 1.795-2.225 3.894-2.834 6.288-.615 2.415-.919 4.982-.919 7.756h-22.55c.097-5.536 1.038-10.589 2.833-15.201zm45.95 65.818v23.616h-24.09v-23.616h24.09z"/></svg>
                </span>
              <input type="text" class="block pl-9 pr-4 py-2 w-full bg-gray-900 text-white rounded-full focus:bg-white focus:text-gray-900 focus:placeholder-gray-600 focus:outline-none" placeholder="Search">
            </span>
            <button></button>
            <button class="text-gray-400 hover:text-gray-200">
              <svg class="h-5 w-5 fill-current" xmlns="http://www.w3.org/2000/svg"
                   viewBox="0 0 302.967 302.967" xml:space="preserve">
                <path d="M151.483 302.967C67.956 302.967 0 235.017 0 151.483S67.956 0 151.483 0s151.483 67.956 151.483 151.483-67.949 151.484-151.483 151.484zm0-278.551c-70.066 0-127.067 57.001-127.067 127.067S81.417 278.55 151.483 278.55 278.55 221.549 278.55 151.483 221.555 24.416 151.483 24.416z"/>
                <path d="M116.586 118.12c1.795-4.607 4.297-8.588 7.511-11.961 3.225-3.389 7.114-6.016 11.667-7.898 4.547-1.904 9.633-2.845 15.262-2.845 7.261 0 13.32.995 18.183 2.997 4.857 1.996 8.768 4.482 11.738 7.441 2.964 2.97 5.091 6.168 6.369 9.584 1.273 3.432 1.915 6.636 1.915 9.595 0 4.901-.642 8.947-1.915 12.118-1.278 3.171-2.866 5.88-4.759 8.131-1.898 2.252-3.987 4.172-6.293 5.755a147.159 147.159 0 0 0-6.516 4.759 30.34 30.34 0 0 0-5.445 5.439c-1.588 2.04-2.589 4.601-2.991 7.664v5.831H140.6v-6.908c.305-4.395 1.153-8.072 2.529-11.036 1.382-2.964 2.991-5.499 4.83-7.598 1.844-2.089 3.786-3.911 5.836-5.445a105.25 105.25 0 0 0 5.673-4.591c1.73-1.545 3.144-3.225 4.221-5.069 1.071-1.833 1.556-4.15 1.452-6.908 0-4.705-1.148-8.18-3.454-10.427-2.295-2.257-5.493-3.378-9.589-3.378-2.758 0-5.134.533-7.131 1.605s-3.628 2.513-4.911 4.302c-1.278 1.795-2.225 3.894-2.834 6.288-.615 2.415-.919 4.982-.919 7.756h-22.55c.097-5.536 1.038-10.589 2.833-15.201zm45.95 65.818v23.616h-24.09v-23.616h24.09z"/></svg>
            </button>
          </div>
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
              <a @click="pick(diagram)" href="#" v-for="diagram in diagrams" :key="diagram.id" class="block px-6 py-3 bg-white border-t">
                <span class="text-sm font-semibold text-gray-900">{{ diagram.title }}</span>
                <div class="flex justify-between">
                  <span class="text-sm font-semibold text-gray-500">{{ diagram.value.diagramType }}</span>
                  <span class="text-sm text-gray-600">2 days ago</span>
                </div>
                <p class="mt-2 text-sm text-gray-600">Source page: {{ diagram.container.id }}</p>
              </a>
            </div>
          </div>
          <div id="workspace-right" class="flex-grow h-full">
            <iframe id='embedded-viewer' src='' width='100%' height='100%'></iframe>
          </div>
        </main>
        <div class="w-80 p-6 bg-gray-100 overflow-y-auto">
          <nav>
            <h2 class="text-xs font-semibold text-gray-600 uppercase tracking-wide">Sort & Filters</h2>
            <div class="mt-3">
              <a href="#"
                 class="-mx-2 mt-2 px-3 py-1 flex items-center justify-between text-sm font-medium bg-gray-200 rounded-lg hover:bg-gray-200">
                <span class="inline-flex">
                  <svg class="h-5 w-5 fill-current text-gray-700" xmlns="http://www.w3.org/2000/svg"
                       viewBox="0 0 302.967 302.967"
                       xml:space="preserve">
                    <path d="M151.483 302.967C67.956 302.967 0 235.017 0 151.483S67.956 0 151.483 0s151.483 67.956 151.483 151.483-67.949 151.484-151.483 151.484zm0-278.551c-70.066 0-127.067 57.001-127.067 127.067S81.417 278.55 151.483 278.55 278.55 221.549 278.55 151.483 221.555 24.416 151.483 24.416z"/>
                    <path d="M116.586 118.12c1.795-4.607 4.297-8.588 7.511-11.961 3.225-3.389 7.114-6.016 11.667-7.898 4.547-1.904 9.633-2.845 15.262-2.845 7.261 0 13.32.995 18.183 2.997 4.857 1.996 8.768 4.482 11.738 7.441 2.964 2.97 5.091 6.168 6.369 9.584 1.273 3.432 1.915 6.636 1.915 9.595 0 4.901-.642 8.947-1.915 12.118-1.278 3.171-2.866 5.88-4.759 8.131-1.898 2.252-3.987 4.172-6.293 5.755a147.159 147.159 0 0 0-6.516 4.759 30.34 30.34 0 0 0-5.445 5.439c-1.588 2.04-2.589 4.601-2.991 7.664v5.831H140.6v-6.908c.305-4.395 1.153-8.072 2.529-11.036 1.382-2.964 2.991-5.499 4.83-7.598 1.844-2.089 3.786-3.911 5.836-5.445a105.25 105.25 0 0 0 5.673-4.591c1.73-1.545 3.144-3.225 4.221-5.069 1.071-1.833 1.556-4.15 1.452-6.908 0-4.705-1.148-8.18-3.454-10.427-2.295-2.257-5.493-3.378-9.589-3.378-2.758 0-5.134.533-7.131 1.605s-3.628 2.513-4.911 4.302c-1.278 1.795-2.225 3.894-2.834 6.288-.615 2.415-.919 4.982-.919 7.756h-22.55c.097-5.536 1.038-10.589 2.833-15.201zm45.95 65.818v23.616h-24.09v-23.616h24.09z"/>
                  </svg>
                  <span class="ml-2 text-gray-900">Recent</span>
                </span>
                <span
                  class="inline-block w-9 text-center py-2 leading-none text-xs font-semibold text-gray-700 bg-gray-300 rounded-full">
                6
              </span>
              </a>
            </div>
            <div class="mt-3">
              <a href="#"
                 class="-mx-2 mt-2 px-3 py-1 flex items-center justify-between text-sm font-medium rounded-lg hover:bg-gray-200">
                <span class="inline-flex">
                  <svg class="h-5 w-5 fill-current text-gray-700" xmlns="http://www.w3.org/2000/svg"
                       viewBox="0 0 302.967 302.967"
                       xml:space="preserve">
                    <path
                      d="M151.483 302.967C67.956 302.967 0 235.017 0 151.483S67.956 0 151.483 0s151.483 67.956 151.483 151.483-67.949 151.484-151.483 151.484zm0-278.551c-70.066 0-127.067 57.001-127.067 127.067S81.417 278.55 151.483 278.55 278.55 221.549 278.55 151.483 221.555 24.416 151.483 24.416z"/>
                    <path
                      d="M116.586 118.12c1.795-4.607 4.297-8.588 7.511-11.961 3.225-3.389 7.114-6.016 11.667-7.898 4.547-1.904 9.633-2.845 15.262-2.845 7.261 0 13.32.995 18.183 2.997 4.857 1.996 8.768 4.482 11.738 7.441 2.964 2.97 5.091 6.168 6.369 9.584 1.273 3.432 1.915 6.636 1.915 9.595 0 4.901-.642 8.947-1.915 12.118-1.278 3.171-2.866 5.88-4.759 8.131-1.898 2.252-3.987 4.172-6.293 5.755a147.159 147.159 0 0 0-6.516 4.759 30.34 30.34 0 0 0-5.445 5.439c-1.588 2.04-2.589 4.601-2.991 7.664v5.831H140.6v-6.908c.305-4.395 1.153-8.072 2.529-11.036 1.382-2.964 2.991-5.499 4.83-7.598 1.844-2.089 3.786-3.911 5.836-5.445a105.25 105.25 0 0 0 5.673-4.591c1.73-1.545 3.144-3.225 4.221-5.069 1.071-1.833 1.556-4.15 1.452-6.908 0-4.705-1.148-8.18-3.454-10.427-2.295-2.257-5.493-3.378-9.589-3.378-2.758 0-5.134.533-7.131 1.605s-3.628 2.513-4.911 4.302c-1.278 1.795-2.225 3.894-2.834 6.288-.615 2.415-.919 4.982-.919 7.756h-22.55c.097-5.536 1.038-10.589 2.833-15.201zm45.95 65.818v23.616h-24.09v-23.616h24.09z"/>
                  </svg>
                  <span class="ml-2 text-gray-900">Sort by title</span>
                </span>
                <span
                  class="inline-block w-9 text-center py-2 leading-none text-xs font-semibold text-gray-700 bg-gray-300 rounded-full">
                6
              </span>
              </a>
            </div>
            <div class="mt-3">
              <a href="#"
                 class="-mx-2 mt-2 px-3 py-1 flex items-center justify-between text-sm font-medium rounded-lg hover:bg-gray-200">
                <span class="inline-flex">
                  <svg class="h-5 w-5 fill-current text-gray-700" xmlns="http://www.w3.org/2000/svg"
                       viewBox="0 0 302.967 302.967"
                       xml:space="preserve">
                    <path
                      d="M151.483 302.967C67.956 302.967 0 235.017 0 151.483S67.956 0 151.483 0s151.483 67.956 151.483 151.483-67.949 151.484-151.483 151.484zm0-278.551c-70.066 0-127.067 57.001-127.067 127.067S81.417 278.55 151.483 278.55 278.55 221.549 278.55 151.483 221.555 24.416 151.483 24.416z"/>
                    <path
                      d="M116.586 118.12c1.795-4.607 4.297-8.588 7.511-11.961 3.225-3.389 7.114-6.016 11.667-7.898 4.547-1.904 9.633-2.845 15.262-2.845 7.261 0 13.32.995 18.183 2.997 4.857 1.996 8.768 4.482 11.738 7.441 2.964 2.97 5.091 6.168 6.369 9.584 1.273 3.432 1.915 6.636 1.915 9.595 0 4.901-.642 8.947-1.915 12.118-1.278 3.171-2.866 5.88-4.759 8.131-1.898 2.252-3.987 4.172-6.293 5.755a147.159 147.159 0 0 0-6.516 4.759 30.34 30.34 0 0 0-5.445 5.439c-1.588 2.04-2.589 4.601-2.991 7.664v5.831H140.6v-6.908c.305-4.395 1.153-8.072 2.529-11.036 1.382-2.964 2.991-5.499 4.83-7.598 1.844-2.089 3.786-3.911 5.836-5.445a105.25 105.25 0 0 0 5.673-4.591c1.73-1.545 3.144-3.225 4.221-5.069 1.071-1.833 1.556-4.15 1.452-6.908 0-4.705-1.148-8.18-3.454-10.427-2.295-2.257-5.493-3.378-9.589-3.378-2.758 0-5.134.533-7.131 1.605s-3.628 2.513-4.911 4.302c-1.278 1.795-2.225 3.894-2.834 6.288-.615 2.415-.919 4.982-.919 7.756h-22.55c.097-5.536 1.038-10.589 2.833-15.201zm45.95 65.818v23.616h-24.09v-23.616h24.09z"/>
                  </svg>
                  <span class="ml-2 text-gray-900">Inbox</span>
                </span>
                <span
                  class="inline-block w-9 text-center py-2 leading-none text-xs font-semibold text-gray-700 bg-gray-300 rounded-full">
                6
              </span>
              </a>
            </div>
            <div class="mt-3">
              <a href="#"
                 class="-mx-2 mt-2 px-3 py-1 flex items-center justify-between text-sm font-medium rounded-lg hover:bg-gray-200">
                <span class="inline-flex">
                  <svg class="h-5 w-5 fill-current text-gray-700" xmlns="http://www.w3.org/2000/svg"
                       viewBox="0 0 302.967 302.967"
                       xml:space="preserve">
                    <path
                      d="M151.483 302.967C67.956 302.967 0 235.017 0 151.483S67.956 0 151.483 0s151.483 67.956 151.483 151.483-67.949 151.484-151.483 151.484zm0-278.551c-70.066 0-127.067 57.001-127.067 127.067S81.417 278.55 151.483 278.55 278.55 221.549 278.55 151.483 221.555 24.416 151.483 24.416z"/>
                    <path
                      d="M116.586 118.12c1.795-4.607 4.297-8.588 7.511-11.961 3.225-3.389 7.114-6.016 11.667-7.898 4.547-1.904 9.633-2.845 15.262-2.845 7.261 0 13.32.995 18.183 2.997 4.857 1.996 8.768 4.482 11.738 7.441 2.964 2.97 5.091 6.168 6.369 9.584 1.273 3.432 1.915 6.636 1.915 9.595 0 4.901-.642 8.947-1.915 12.118-1.278 3.171-2.866 5.88-4.759 8.131-1.898 2.252-3.987 4.172-6.293 5.755a147.159 147.159 0 0 0-6.516 4.759 30.34 30.34 0 0 0-5.445 5.439c-1.588 2.04-2.589 4.601-2.991 7.664v5.831H140.6v-6.908c.305-4.395 1.153-8.072 2.529-11.036 1.382-2.964 2.991-5.499 4.83-7.598 1.844-2.089 3.786-3.911 5.836-5.445a105.25 105.25 0 0 0 5.673-4.591c1.73-1.545 3.144-3.225 4.221-5.069 1.071-1.833 1.556-4.15 1.452-6.908 0-4.705-1.148-8.18-3.454-10.427-2.295-2.257-5.493-3.378-9.589-3.378-2.758 0-5.134.533-7.131 1.605s-3.628 2.513-4.911 4.302c-1.278 1.795-2.225 3.894-2.834 6.288-.615 2.415-.919 4.982-.919 7.756h-22.55c.097-5.536 1.038-10.589 2.833-15.201zm45.95 65.818v23.616h-24.09v-23.616h24.09z"/>
                  </svg>
                  <span class="ml-2 text-gray-900">Inbox</span>
                </span>
                <span
                  class="inline-block w-9 text-center py-2 leading-none text-xs font-semibold text-gray-700 bg-gray-300 rounded-full">
                6
              </span>
              </a>
            </div>

          </nav>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import globals from '@/model/globals';
  import SaveAndGoBackButton from "@/components/SaveAndGoBackButton";
  import {DiagramType} from "@/model/Diagram";

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
    methods: {
      pick(document) {
        this.picked = document;
        window.picked = document;
      }
    },
    watch: {
      picked: function(value) {
        // eslint-disable-next-line
        window.picked = value;

        console.debug('picked value:', value);

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
        iframe.src = `${getViewerUrl(value.value.diagramType)}${window.location.search}&rendered.for=custom-content-native&content.id=${value.id}&embedded=true`;
      }
    },
    components: {
      SaveAndGoBackButton,
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
