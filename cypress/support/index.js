Cypress.on("window:before:load", (win) => {
  // Override the `beforeunload` event
  win.onbeforeunload = null;
});
