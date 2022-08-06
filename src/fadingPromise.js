function fadingPromise(timeout, resolveConsumer) {
  let finalizer;
  return new Promise((resolve, reject) => {
    const cancel = resolveConsumer(resolve);
    const timeoutId = setTimeout(() => reject(`Timeout after ${timeout} ms`), timeout);

    finalizer = () => {
      if (cancel) cancel();
      clearTimeout(timeoutId);
    }
  }).catch(console.error).finally(finalizer);
}

function intervalCallback(interval, resolveConsumer) {
  return resolve => {
    const intervalId = setInterval(() => resolveConsumer(resolve), interval);

    return () => clearTimeout(intervalId);
  }
}