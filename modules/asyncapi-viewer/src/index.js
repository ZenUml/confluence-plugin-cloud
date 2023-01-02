import React from "react";
import ReactDOM from "react-dom";
import AsyncApiComponent from "@asyncapi/react-component";
import { decode } from 'js-base64';
import "@asyncapi/react-component/lib/styles/fiori.css";
import * as htmlToImage from 'html-to-image';
import "./styles.css";

const urlParams = new URLSearchParams(window.location.search);
const base64 = urlParams.get('base64');
const data = base64 && decode(base64) || localStorage.document;

const rootElement = document.getElementById("root");
const config = {
  expand: {
    channels: {
      root: true,
      elements: true,
    },
    servers: {
      root: true,
      elements: true,
    },
    messages: {
      root: true,
      elements: true,
    },
    schemas: {
      root: true,
      elements: true,
    },
  }
};
ReactDOM.render(<AsyncApiComponent schema={data} config={config} />, rootElement);

window.toPng = () => {
  const root = document.getElementById('root') || document.body;
  return htmlToImage.toBlob(root, { bgcolor: 'white' });
}

window.addEventListener('message', async ({ source, data }) => {
  if (source.location.href !== window.location.href && data?.action === 'export') {
    const data = await window.toPng();
    source.postMessage({ action: 'export.result', data });
    console.debug('asyncapi-viewer - PNG exported');
  }
})