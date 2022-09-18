const awaitNode = async (parent, selector, required = true, timeout = 15_000) => {
    const awaitId = randomId();
    logger.group(selector);
    logger.time(selector);

    try {
        return await fadingPromise(timeout, callback);
    } catch (e) {
        if (required) {
            throw e;
        }
        logger.info(e);
    } finally {
        logger.timeEnd(selector);
        logger.groupEnd(selector);
    }

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