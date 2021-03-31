import express from 'express';
import path from "path";
import React from 'react';
import { renderToString } from 'react-dom/server';
import { ServerStyleSheet } from 'styled-components'

export function addServerSideRendering(app, handlebarsEngine) {
  const devEnv = app.get('env') === 'development';
  const viewsDir = app.get('views');
  // Serve the views directory so we can include the component's script on the page
  app.use(express.static(viewsDir));
  const ssrEngine = function (viewFile, options, callback) {
    // Allow specifying the template by the name of the source file or the transpiled file
    const viewFilePath = viewFile.replace(/\.jsx$/,'.js');
    const relativeViewFilePath = path.join('/', path.relative(viewsDir, viewFilePath));
    // The `build` script produces a nodejs-friendly and a browser-friendly version of the view.
    const nodeViewPath = path.join(viewsDir, 'node', relativeViewFilePath);
    const props = { ...options };
    // The properties included in all template render calls include some potentially-sensitive data we don't want to
    // expose in the serialised properties on the page, so leave those out.
    for (const key of Object.keys(props._locals)) {
      if (props[key] === props._locals[key]) {
        delete props[key];
      }
    }
    delete props._locals;
    delete props.settings;
    delete props.cache;
    let sheet = null;
    try {
      const ssrOptions = {
        body: '',
        syleTags: ''
      };
      // Provide an option for skipping server-side rendering in case it causes issues or is simply not necessary.
      if (!options.browserOnly) {
        // Some atlaskit components use a css-in-js solution called "Styled Components" (though most have switched to Emotion).
        // It requires some special handling when rendering on the server.
        sheet = new ServerStyleSheet();
        // Dynamically require the component file that was requested. Assume the root component is the default export.
        // Ensure we pick up the latest version if we're running in dev mode.
        if (devEnv) delete require.cache[nodeViewPath];
        const rootElement = React.createElement(require(nodeViewPath).default, props);
        ssrOptions.body = renderToString(sheet.collectStyles(rootElement));
        ssrOptions.styleTags = sheet.getStyleTags();
      }
      const viewOptions = {
        ...options,
        ...ssrOptions,
        // React is configured as an "external" so we can share a cached, CDN-delivered version between pages.
        reactSource: `//unpkg.com/react@16/umd/react.${devEnv ? 'development' : 'production.min'}.js`,
        reactDomSource: `//unpkg.com/react-dom@16/umd/react-dom.${devEnv ? 'development' : 'production.min'}.js`,
        rootComponentSource: relativeViewFilePath,
        // Supply props for rendering / hydration
        props: JSON.stringify(props)
      };
      const layoutTemplate = path.join(viewsDir, 'react-layout.hbs');
      return handlebarsEngine(
        layoutTemplate,
        viewOptions,
        callback
      );
    } catch (e) {
      if (e && e.code === 'MODULE_NOT_FOUND') {
        return callback(new Error(`Could not load the component ${path.basename(viewFile)}. Did you run \`npm build\` to compile your jsx files?`));
      }
      return callback(e);
    } finally {
      sheet && sheet.seal();
    }
  };
  app.engine('.js', ssrEngine);
  app.engine('.jsx', ssrEngine);
}

