import * as React from "react";
import AP from "@/model/AP";
import { SaveAndGoBackButton } from "@/components/SaveAndGoBackButton.react";
import { DataSource, DiagramType } from "@/model/Diagram/Diagram";
import { saveToPlatform } from "@/model/ContentProvider/Persistence";

async function saveOpenApiAndExit () {
  console.log("save")
  // @ts-ignore
  const code = window.specContent;
  const diagram = {
    title: '',
    code: code,
    styles: {},
    mermaidCode: '',
    diagramType: DiagramType.OpenApi,
    source: DataSource.CustomContent
  };
  // @ts-ignore
  window.diagram = Object.assign(window.diagram || {}, diagram);
  // @ts-ignore
  await saveToPlatform(window.diagram);

  /* eslint-disable no-undef */
  AP.dialog.close();
}

export const SaveButtonComponentPlugin = function() {
  return {
    wrapComponents: {
      BaseLayout: (Original: any) => (props: any) => {
        return (
          <div>
            <SaveAndGoBackButton saveAndExit={saveOpenApiAndExit} />
            <Original {...props} />
          </div>
        );
      }
    }
  }
}