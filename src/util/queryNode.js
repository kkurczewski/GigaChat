const queryNode = async (parent, selector, required = true, timeout = 15_000) => {
    const awaitGroup = `Await ${selector}`;
    console.groupCollapsed(awaitGroup);
    console.time(`Query ${selector}`);

    try {
        return await fadingPromise(timeout, callback);
    } catch (e) {
        if (required) {
            throw e;
        }
        console.info(e);
    } finally {
        console.timeEnd(`Query ${selector}`);
        console.groupEnd(awaitGroup);
    }

    function callback(resolve) {
        const cancel = elementInsertedCallback(parent, selector, (node) => {
            resolve(node);
            console.debug("Resolved promise using observer");
        });
        const node = parent.querySelector(selector);
        if (node) {
            cancel();
            resolve(node);
            console.debug("Resolved promise using selector");
        }
        return cancel;
    }
}