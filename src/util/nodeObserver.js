function registerClassObserver(observedNode, classSelector, callback) {
    const observer = new MutationObserver(mutations => {
        console.debug("Got new class mutations");
        const matches = mutations.some(mutation => mutation.target.matches(classSelector));
        callback(matches);
    });

    observer.observe(observedNode, {
        attributes: true,
        attributeFilter: ["class"],
    });
    console.debug("Started class", classSelector, "observer");
}

function registerAttributeObserver(observedNode, attribute, callback) {
    const observer = new MutationObserver(mutations => {
        console.debug("Got new attribute mutations");
        mutations
            .map(mutation => mutation.target.hasAttribute(attribute))
            .forEach(callback);
    });

    observer.observe(observedNode, {
        attributes: true,
        attributeFilter: [attribute],
    });
    console.debug("Started attribute", attribute, "observer");
}
