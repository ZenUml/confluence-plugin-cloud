import React, { FormEventHandler, useEffect, useState } from "react";
import { trackEvent } from "@/utils/window";
import { SaveAndGoBackButton } from "./SaveAndGoBackButton";
import yaml from "js-yaml";

interface Props {
  saveAndExit: VoidFunction;
}
const Component = ({ saveAndExit }: Props) => {
  const [title, setTitle] = useState("");

  const helpClick = () => {
    trackEvent("help", "click", "open-api");
  };

  const setTitleWithSideEffect = (value: any) => {
    setTitle(value);
    if (window.diagram) {
      window.diagram.title = value;
    }
  };

  const changeTitle: FormEventHandler<HTMLInputElement> = e => {
    setTitleWithSideEffect(e.currentTarget.value);
    if (window.diagram) {
      yaml.loadAll(window.specContent || '', function (data) {
        const doc: Record<string, any> = data as any;
        doc.info.title = e.currentTarget.value;
        window.editor.specActions.updateSpec(yaml.dump(doc));
      });
    }
  };
  useEffect(() => {
    if (window.diagram) {
      yaml.loadAll(window.diagram.code || '', function (data) {
        const doc: Record<string, any> = data as any;
        if (doc?.info?.title) setTitleWithSideEffect(doc.info.title);
      });
    }
    const handleEditorChange = (spec: string) => {
      yaml.loadAll(spec, function (data) {
        const doc: Record<string, any> = data as any;
        setTitleWithSideEffect(doc?.info?.title || '');
      });
    };
    if (!window.specListeners) window.specListeners = [];
    window.specListeners.push(handleEditorChange);
    return () => {
      if (!window.specListeners) return
      window.specListeners = window.specListeners.filter(
        (listener: any) => listener !== handleEditorChange
      );
    };
  }, []);

  return (
    <header className="toolbar header border-b border-gray-800 p-2 flex items-center justify-between w-full">
      <div className="flex">
        <input
          className="px-1 border-2 border-solid border-[#091e4224] rounded-[3px] focus:border-[#388bff] hover:border-[#388bff] outline-none transition-[border-color] leading-7"
          type="text"
          placeholder="Title"
          value={title}
          onInput={changeTitle}
        />
      </div>
      <div className="flex items-center">
        <a
          className="inline-block help mx-1 ml-2"
          target="_blank"
          href="helpUrl"
        >
          <button
            className="flex items-center bg-gray-100 px-2 py-1 text-gray-600 text-sm font-semibold rounded"
            onClick={helpClick}
          >
            <span>
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
            </span>
            <span>Help</span>
          </button>
        </a>
        <div className="inline-block ml-2">
          <SaveAndGoBackButton saveAndExit={saveAndExit} disabled={!title} />
        </div>
      </div>
    </header>
  );
};



export default Component;
