const awaitNode = (parent, selector, required = true, timeout = 15_000) => {
    const awaitId = randomId();
    logger.group(selector);
    logger.time(selector);

    const node = fadingPromise(timeout, callback);
    logger.timeEnd(selector);
    logger.groupEnd(selector);

    if (required) {
        logger.assert(node != null)
    }
    return node;

    function callback(resolve) {
        const cancel = elementInsertedCallback(parent, selector, resolve);
        const node = parent.querySelector(selector);
        if (node) {
            resolve(node);
            cancel();
        }
        return cancel;
    }
}