function randomId() {
    return (37e16 * Math.random() + 37e16).toString(32);
}

// TODO try to use query selector in order to find nodes instead checking nodes by hand
function elementInsertedCallback(observedNode, elementSelector, callback) {
    let canceled = false;
    const observerId = randomId();
    const observer = new MutationObserver(onNewMutations);

    console.debug(`Starting one-shot observer [${observerId}] for selector [${elementSelector}]`);
    observer.observe(observedNode, {
        subtree: true,
        childList: true,
    });

    return disconnect;

    function onNewMutations(mutations) {
        console.debug(`Observer [${observerId}] detected added nodes`);
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
        if (canceled) {
            return;
        }
        canceled = true;
        observer.disconnect();
        console.debug(`Disconnected observer [${observerId}]`);
    }
}