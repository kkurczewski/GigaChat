async function find(root, selector) {
    return new Promise(resolve => {
        const observer = new MutationObserver((_, observer) => {
            tryResolve(observer)
        })

        const config = { childList: true }
        observer.observe(root, config)
        tryResolve(observer)

        function tryResolve(observer) {
            const node = root.querySelector(selector)
            if (node) {
                observer.disconnect()
                resolve(node)
            }
        }
    })
}