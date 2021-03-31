Check if it is printed in the Chrome console that preloaded
JavaScript is not used.
Make sure in vue.config.js add the following under pages->graph-editor:
```
  chunks: ['chunk-common', 'chunk-graph-editor-vendors', 'graph-editor']
```
