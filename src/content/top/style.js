const CSS_ROOT = ":root";
const TOGGLE_BUTTON = "#show-hide-button";

const HIDDEN_CLASS = "x-hidden";
const LEFT_CLASS = "left";
const RIGHT_CLASS = "right";

const OPACITY_VAR = "--opacity";
const TOP_MARGIN_VAR = "--top-margin";
const BOTTOM_MARGIN_VAR = "--bottom-margin";

function updateChatContainerStyle(chat, options) {
  updateStyleVariables();
  updateCssPosition();
  updateToggleButton();
  console.debug("Updated chat container styles");

  function updateStyleVariables() {
    const cssRoot = document.querySelector(CSS_ROOT);
    cssRoot.style.setProperty(OPACITY_VAR, options.opacity);
    cssRoot.style.setProperty(TOP_MARGIN_VAR, options.topMargin + "%");
    cssRoot.style.setProperty(BOTTOM_MARGIN_VAR, options.bottomMargin + "%");
  }

  function updateCssPosition() {
    switch (options.position) {
      case LEFT_CLASS:
        chat.classList.add(LEFT_CLASS);
        chat.classList.remove(RIGHT_CLASS);
        break;
      case RIGHT_CLASS:
        chat.classList.add(RIGHT_CLASS);
        chat.classList.remove(LEFT_CLASS);
        break;
    }
  }

  function updateToggleButton() {
    chat.querySelector(TOGGLE_BUTTON).classList.toggle(HIDDEN_CLASS, !options.toggleButton);
  }
}