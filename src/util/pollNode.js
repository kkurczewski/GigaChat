function pollNode(parent, selector, timeout = 15_000) {
  return fadingPromise(timeout, callback);

  function callback(resolve) {
    const stopObserver = startObserver(parent, selector, resolve);
    const node = parent.querySelector(selector);
    if (node) {
      resolve(node);
      stopObserver();
    }
  }
}

function startObserver(parent, selector, callback) {
  const observer = new MutationObserver(observerCallback);

  observer.observe(parent, {
    subtree: true,
    childList: true,
  });
  console.debug("Started observer for node:", selector);

  return () => observer.disconnect();

  function observerCallback(mutations) {
    console.debug("Got mutations");

    const result = mutations
      .map(mutation => mutation.addedNodes)
      .flatMap(addedNodes => Array.from(addedNodes))
      .filter(s => s instanceof Element)
      .find(node => node.matches(selector));

    if (result) {
      callback(result);
      observer.disconnect();
      console.debug("Disconnected observer");
    } else {
      console.debug("Pending search for node:", selector);
    }
  }
}