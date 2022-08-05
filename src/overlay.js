async function styleChatOverlay(parent, options, fullscreenEnabled) {
  if (!options.enabled) {
    // TODO auto rollback changes
    return;
  }
  console.info("Overlay enabled with options:", options);

  const videoContainer = parent.querySelector("#ytd-player #container");
  const liveChat = parent.querySelector("#chat");
  const liveChatFrame = liveChat.querySelector("#chatframe");

  setOverlayStyle(liveChat);

  // critical section
  // moving node reloads frame (and clears style if already set)
  if (liveChat.parentNode !== videoContainer) {
    videoContainer.appendChild(liveChat);
  }

  // ...wait for iframe to reload
  const liveChatBox = await queryIFrameNode(liveChatFrame, "yt-live-chat-renderer");

  // ...before applying style
  setChatOpacity(liveChatBox, options.opacity);
  styleScrollbar();
  hideHeader(options.header);
  hideToggleButton(options.toggleButton);

  console.info("Overlay applied");

  function setOverlayStyle(node) {
    const overlayStyle = {
      position: "absolute",
      zIndex: 10,
      top: 0,
      bottom: "65px",
      width: "33%",
      height: "auto",
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
     if (options.position === "left") {
       // show scrollbar always on edge of screen
       itemScroll.style.direction = "rtl";
       // ...but keep chat as usual
       itemScroll.querySelector("#items").style.direction = "ltr";
     } else {
       itemScroll.style.direction = "";
     }
  }

  async function hideHeader(enabled) {
    if (!enabled) {
      (await queryIFrameNode(liveChatFrame, "yt-live-chat-header-renderer")).style.display = "none";
    }
  }

  async function hideToggleButton(enabled) {
    if (!enabled) {
      (document.querySelector("#show-hide-button")).style.display = "none";
      // hide 1px separator
      (await queryIFrameNode(liveChatFrame, "#input-panel")).style.display = "none";
    }
  }

  function setChatOpacity(node, opacity) {
    const backgroundColor = window.getComputedStyle(node).backgroundColor;
    node.style.background = addTransparency(backgroundColor);

    function addTransparency(rgbColor) {
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