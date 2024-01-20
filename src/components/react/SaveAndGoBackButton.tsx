import * as React from "react";

interface Props {
  saveAndExit: () => void;
  disabled?: boolean;
}

export function SaveAndGoBackButton(props: Props) {
  return (
    <div className=" inline-block ml-2">
      <button
        className="flex items-center bg-blue-700 px-2 py-1 text-white text-sm font-semibold rounded disabled:bg-gray-300"
        onClick={props.saveAndExit}
        disabled={props.disabled}
      >
        <span>
          <svg
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15 19l-7-7 7-7"
            ></path>
          </svg>
        </span>
        <span>Save and Go back to Confluence</span>
      </button>
    </div>
  );
}
