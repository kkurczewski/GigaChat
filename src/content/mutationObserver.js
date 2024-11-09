/**
 * @param {Element} target 
 * @param {string} selector 
 * @returns {Promise<Element>}
 */
async function find(target, selector, subtree = false) {
  return new Promise(resolve => {
    const observer = new MutationObserver((_, observer) => {
      tryResolve(observer)
    })

    const config = { childList: true, attributes: true, subtree }
    observer.observe(target, config)
    tryResolve(observer)

    function tryResolve(/** @type {MutationObserver} */ observer) {
      const node = target.querySelector(selector)
      if (node) {
        observer.disconnect()
        resolve(node)
      }
    }
  })
}

/**
 * @param {Element} target 
 * @param {string} selector 
 * @param {function} callback
 */
function observe(target, selector, callback) {
  const observer = new MutationObserver(onMutation)
  const config = { childList: true }
  observer.observe(target, config)

  function onMutation(/** @type {Array<MutationRecord>} */ mutations) {
    mutations.forEach(({ addedNodes }) => {
      addedNodes.forEach(node => {
        // @ts-ignore
        if (node?.matches?.(selector)) {
          callback(node)
        }
      })
    })
  }
}