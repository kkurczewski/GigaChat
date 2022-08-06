window.onload = () => {
  console.log("YLCHO started");

  chrome.storage.local.get("options", data => loadOptions(data.options));

  chrome.storage.onChanged.addListener((changes, namespace) => {
    loadOptions(changes.options.newValue).catch(console.error);
  });

  async function loadOptions(options) {
    console.debug("Loaded options from storage", options);

    console.debug("Await DOM tree");
    const parent = document.querySelector("ytd-app");
    await queryNodes(
      parent,
      ["ytd-player", "container", "chat", "chatframe", "show-hide-button"],
      ["ytd-watch-flexy"],
    );

    console.debug("Node listeners finished work");

    const video = parent.querySelector("ytd-watch-flexy");
    registerFullscreenListener(video, fullscreenCallback);

    const chatFrame = parent.querySelector("#chatframe");
    chatFrame.onload = () => styleChatOverlay(parent, options, video.hasAttribute("fullscreen"));

    fullscreenCallback(false);

    function fullscreenCallback(fullscreenEnabled) {
      styleChatOverlay(parent, options, fullscreenEnabled);
    }
  }

  function registerFullscreenListener(node, callback) {
    const observer = new MutationObserver(mutations => {
      console.debug("Got new attribute mutations");
      mutations.forEach(mutation => callback(mutation.target.hasAttribute("fullscreen")));
    });

    observer.observe(node, {
      attributes: true,
      attributeFilter: ["fullscreen"],
    });
    console.debug("Started fullscreen observer");
  }

  function queryNodes(parentNode, nodesIds, nodeTypes) {
    return fadingPromise(15_000, callback);

    function callback(resolve) {
      const observer = new MutationObserver(observerCallback);

      observer.observe(parentNode, {
        subtree: true,
        childList: true,
      });
      console.debug("Started node listener");

      console.debug("Check for missed nodes");
      nodesIds = nodesIds.filter(nodeId => parentNode.querySelector("#" + nodeId) == null);
      nodeTypes = nodeTypes.filter(nodeType => parentNode.querySelector(nodeType) == null);

      checkStopCondition();

      return () => observer.disconnect();

      function observerCallback(mutations) {
        console.debug("Got mutations");

        mutations
          .map(mutation => mutation.addedNodes)
          .flatMap(nodes => Array.from(nodes))
          .filter(node => matchesAnyId(node) || matchesAnyType(node))
          .forEach(processNode);

        checkStopCondition();

        function processNode(node) {
          console.debug("Listener found a node:", node);
          if (matchesAnyId(node)) {
            nodesIds = nodesIds.filter(id => id !== node.id);
          } else if (matchesAnyType(node)) {
            nodeTypes = nodeTypes.filter(type => type !== node.nodeName.toLowerCase());
          }

          console.debug("Check for missed nodes inside mutated node");
          nodesIds = nodesIds.filter(nodeId => node.querySelector("#" + nodeId) == null);
          nodeTypes = nodeTypes.filter(nodeType => node.querySelector(nodeType) == null);
        }

        function matchesAnyId(node) {
          return nodesIds.some(id => node?.id === id);
        }

        function matchesAnyType(node) {
          return nodeTypes.some(type => node.nodeName.toLowerCase() === type);
        }
      }

      function checkStopCondition() {
        if (nodesIds.length) {
          console.debug("Pending search for ids:", nodesIds);
        }
        if (nodeTypes.length) {
          console.debug("Pending search for nodes:", nodeTypes);
        }
        if (!nodesIds.length && !nodeTypes.length) {
          observer.disconnect();
          console.debug("Removed listener");

          resolve();
        }
      }
    };
  }
}