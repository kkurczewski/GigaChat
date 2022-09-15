
function classMutationsListener(observedNode, elementSelector, listener) {
    const observerId = randomId();
    const observer = new MutationObserver(onNewMutations);

    logger.debug(`Starting endless observer [${observerId}] for class [${elementSelector}]`);
    observer.observe(observedNode, {
        attributes: true,
        attributeFilter: ["class"],
    });

    function onNewMutations(mutations) {
        logger.trace(`Observer [${observerId}] detected class mutation`);
        const matches = mutations.some(mutation => mutation.target.matches(elementSelector));
        logger.trace(`Observer [${observerId}] will trigger callback with [${matches}]`);
        listener(matches);
    }
}

function attributeMutationsListener(observedNode, attribute, listener) {
    const observerId = randomId();
    const observer = new MutationObserver(onNewMutations);

    logger.debug(`Starting endless observer [${observerId}] for attribute [${attribute}]`);
    observer.observe(observedNode, {
        attributes: true,
        attributeFilter: [attribute],
    });

    function onNewMutations(mutations) {
        logger.trace(`Observer [${observerId}] detected attribute mutation`);
        const matches = mutations.some(mutation => mutation.target.hasAttribute(attribute));
        logger.trace(`Observer [${observerId}] will trigger callback with [${matches}]`);
        listener(matches);
    }
}

// TODO try to use query selector in order to find nodes instead checking nodes by hand
function elementInsertedCallback(observedNode, elementSelector, callback) {
    const observerId = randomId();
    const observer = new MutationObserver(onNewMutations);

    logger.debug(`Starting one-shot observer [${observerId}] for selector [${elementSelector}]`);
    observer.observe(observedNode, {
        subtree: true,
        childList: true,
    });

    return disconnect;

    function onNewMutations(mutations) {
        logger.trace(`Observer [${observerId}] detected added nodes`);
        const result = mutations
            .map(mutation => mutation.addedNodes)
            .flatMap(addedNodes => Array.from(addedNodes))
            .filter(s => s instanceof Element)
            .find(node => node.matches(elementSelector));

        if (result) {
            callback(result);
            disconnect();
        }
    }

    function disconnect() {
        observer.disconnect();
        logger.debug(`Disconnected observer [${observerId}]`);
    }
}
