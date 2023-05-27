import * as React from "react";
import { Toolbar } from '@/components/Toolbar';

export const ToolbarComponentPlugin = function () {
  return {
    components: {
      Toolbar: Toolbar
    },
    wrapComponents: {
      BaseLayout: (Original: any, system: any) => {
        const Toolbar = system.getComponent("Toolbar")
        return (props: any) => {
          return (
            <div>
              <Toolbar />
              <Original {...props} />
            </div>
          );
        }
      }
    }
  }
}
