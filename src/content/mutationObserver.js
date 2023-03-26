async function find(target, selector) {
    return new Promise(resolve => {
        const observer = new MutationObserver((_, observer) => {
            tryResolve(observer)
        })

        const config = { childList: true, attributes: true }
        observer.observe(target, config)
        tryResolve(observer)

        function tryResolve(observer) {
            const node = target.querySelector(selector)
            if (node) {
                observer.disconnect()
                resolve(node)
            }
        }
    })
}

function observe(target, selector, callback) {
    const observer = new MutationObserver(onMutation)
    const config = { childList: true }
    observer.observe(target, config)

    function onMutation(mutations) {
        mutations.forEach(({ addedNodes }) => {
            addedNodes.forEach(node => {
                if (node.matches?.(selector)) {
                    callback(node)
                }
            })
        })
    }
}
