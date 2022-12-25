import React from "react";
import ReactDOM from "react-dom";
import AsyncApiComponent from "@asyncapi/react-component";
import { decode } from 'js-base64';
import "@asyncapi/react-component/lib/styles/fiori.css";
import * as htmlToImage from 'html-to-image';
import "./styles.css";

const urlParams = new URLSearchParams(window.location.search);
const base64 = urlParams.get('base64');
const data = decode(base64);

const rootElement = document.getElementById("root");
ReactDOM.render(<AsyncApiComponent schema={data} />, rootElement);

window.toPng = () => {
  return htmlToImage.toBlob(document.body, {bgcolor: 'white'});
}

window.addEventListener('message', async ({source, data}) => {
  if(source.location.href !== window.location.href && data?.action === 'export') {
    const data = await window.toPng();
    source.postMessage({action: 'export.result', data});
    console.debug('asyncapi-viewer - PNG exported');
  }
})