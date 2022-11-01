/**
 * @param {object} states object containing nested object with state names. 
 * Each state can define list of event listeners. Each listener may take 
 * function argument that allows to switch to different state.
 * 
 * First defined state becomes default state.
 * 
 * @example
 * const fsm = stateMachine({
 *  idle: {
 *   start: (changeState) => { changeState("started"); }
 *  },
 *  started: {
 *   stop: (changeState) => { changeState("idle"); }
 *  }
 * })
 * 
 * fsm.consumeEvent("start");
 */
function stateMachine(states) {
  let currentState = Object.keys(states)[0];
  let state = states[currentState];

  function consumeEvent(event) {
    const callback = state[event];
    if (callback) {
      console.log(`Consuming event [${currentState}::${event}]`);
      callback(changeState);
    }
  }

  function changeState(name) {
    if (state._onExit) {
      state._onExit();
    }
    state = states[name];
    currentState = name;
    if (!state) {
      throw new Error(`State not exists: ${name}`);
    }
    console.log(`Changed state to {${name}}`);
    if (state._onEnter) {
      state._onEnter();
    }
  }

  function registerEnterCallback(name, callback) {
    const state = states[name]
    if (!state) {
      throw new Error(`State not exists: ${name}`);
    }
    state._onEnter = callback;
  }

  function registerExitCallback(name, callback) {
    const state = states[name]
    if (!state) {
      throw new Error(`State not exists: ${name}`);
    }
    state._onExit = callback;
  }

  return {
    consumeEvent,
    registerEnterCallback,
    registerExitCallback,
  };
}
