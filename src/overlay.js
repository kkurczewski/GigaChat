async function styleChatOverlay(parent, options, fullscreenEnabled) {
  console.info("Overlay enabled with options:", options);

  const videoContainer = parent.querySelector("#ytd-player #container");
  const liveChat = parent.querySelector("#chat");
  const liveChatFrame = liveChat.querySelector("#chatframe");

  setOverlayStyle(liveChat);

  // critical section
  // moving node reloads frame (and clears style if already set)
  positionChatContainer()

  // ...wait for iframe to reload
  const liveChatBox = await queryIFrameNode(liveChatFrame, "yt-live-chat-renderer");

  // ...before applying style
  setChatOpacity(liveChatBox);
  styleScrollbar();
  hideHeader();
  hideToggleButton();

  console.info("Overlay applied");

  async function positionChatContainer() {
    if (!options.enabled) {
      const chatSibling = parent.querySelector("#chat-template");
      const originalParent = chatSibling.parentNode;
      if (liveChat.parentNode !== originalParent) {
        originalParent.insertBefore(liveChat, chatSibling);
      }
    } else if (liveChat.parentNode !== videoContainer) {
      videoContainer.appendChild(liveChat);
    }
  }

  function setOverlayStyle(node) {
    if (!options.enabled) {
      node.style = "";
      return;
    }
    const overlayStyle = {
      position: "absolute",
      zIndex: 10,
      top: 0,
      bottom: "65px",
      width: "33%",
      height: options.height === 1 ? "auto" : (options.height * 60 + 28) + '%',
      minHeight: "auto",
      margin: 0,
      border: 0,
      ...parsePosition(options.position),
    };
    Object
      .entries(overlayStyle)
      .forEach(([key, value]) => {
        node.style[key] = value;
      });

    function parsePosition(position) {
      switch (position) {
        case "left":
          return {
            left: 0,
            right: "auto",
          };
        case "right":
          return {
            left: "auto",
            right: 0,
          };
      }
    }
  }

  async function styleScrollbar() {
     const itemScroll = await queryIFrameNode(liveChatFrame, "#item-scroller");
     if (options.enabled && options.position === "left") {
       // show scrollbar always on edge of screen
       itemScroll.style.direction = "rtl";
       // ...but keep chat as usual
       itemScroll.querySelector("#items").style.direction = "ltr";
     } else {
       itemScroll.style.direction = "";
     }
  }

  async function hideHeader() {
    const header = await queryIFrameNode(liveChatFrame, "yt-live-chat-header-renderer");
    if (!options.enabled) {
      header.style.opacity = 1.0;
      header.style.display = "";
      return;
    }
    header.style.opacity = Math.min(options.opacity + 0.1, 1.0);
    if (!options.header) {
      header.style.display = "none";
    } else {
      header.style.display = "";
    }
  }

  async function hideToggleButton() {
    const toggleButton = document.querySelector("#show-hide-button");
    const separator = await queryIFrameNode(liveChatFrame, "#input-panel");
    if (!options.enabled) {
      toggleButton.style.opacity = 1.0;
      toggleButton.style.display = "";
      separator.style.display = "";
      return;
    }
    toggleButton.style.opacity = Math.min(options.opacity + 0.1, 1.0);
    if (options.enabled && !options.toggleButton) {
      toggleButton.style.display = "none";
      separator.style.display = "none";
    } else {
      toggleButton.style.display = "";
      separator.style.display = "";
    }
  }

  function setChatOpacity(node) {
    const backgroundColor = window.getComputedStyle(node).backgroundColor;
    node.style.background = addTransparency(backgroundColor, options.enabled ? options.opacity : 1.0);

    function addTransparency(rgbColor, opacity) {
      // color returned from style property is string of format "rgb(xx,yy,zz)"
      if (rgbColor.startsWith('rgba')) {
        return rgbColor.replace(/[0-9]+[)]/, opacity + ')')
      } else {
        return rgbColor.replace(")", ", " + opacity + ")");
      }
    }
  }

  function queryIFrameNode(frame, selector, interval = 300, timeout = 15_000) {
    return fadingPromise(timeout, intervalCallback(interval, callback));

    function callback(resolve) {
      console.debug("Trying to query iframe");
      const node = frame.contentDocument.querySelector(selector);
      if (node) {
        resolve(node);
        console.debug("Resolved iframe:", node);
      }
    }
  }
}