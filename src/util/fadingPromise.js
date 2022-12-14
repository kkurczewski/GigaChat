function randomId() {
  return (37e16 * Math.random() + 37e16).toString(32);
}

/**
 * @param {number} timeout - time after which callback will be canceled
 * @param {function} callback - cancelable promise-like function
 * 
 * @returns promise which will will be automatically rejected after given timeout
 * @throws string message (non-Error) when timeout occurred
 */
function fadingPromise(timeout, callback) {
  const promiseId = randomId();
  console.debug(`Starting promise [${promiseId}]`);

  let tearDown;
  return new Promise((resolve, reject) => {
    const cancel = callback(resolve);
    const timeoutId = setTimeout(() => reject(`Timeout after ${timeout} ms`), timeout);

    tearDown = () => {
      if (cancel) cancel();
      clearTimeout(timeoutId);
      console.debug(`Promise [${promiseId}] finished`);
    }
  }).finally(tearDown);
}

/**
 * @param {number} interval - interval between subsequent callback calls
 * @param {function} callback - cancelable promise-like function
 * 
 * @returns cancelable promise-like function that repeats given callback with given interval
 */
function intervalCallback(interval, callback) {
  return resolve => {
    const intervalId = setInterval(() => callback(resolve), interval);
    console.debug(`Started interval callback [${intervalId}]`);

    return () => {
      clearTimeout(intervalId);
      console.debug(`"Started interval callback [${intervalId}]`);
    }
  }
}