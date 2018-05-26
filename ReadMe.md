# Output
## edit.html, edit.js
These two files are used to insert or update the sequence diagram. 
  
## view.html, view.js
These two files are used to render the diagram in the confluence page.

# Questions

1. There is not webpack config, how to configure the output?
    
    By default the, `vue-cli-service` create a Zero-config project structure. 
    Webpack's configure can be added to vue.config.js.
    ````
    module.exports = {
      configureWebpack: config => {
        // ...
      }
    };
    ````
2. T

