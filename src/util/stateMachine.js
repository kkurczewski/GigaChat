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
 *   start: (changeState) => changeState("started"),
 *  },
 *  started: {
 *   stop: (changeState) => changeState("idle"),
*    _onEnter: () => console.log("Enter state"),
 *   _onExit: () => console.log("Exit state"),
 *  }
 * })
 * 
 * fsm.consumeEvent("start");
 */
function stateMachine(machineName, states) {
  let currentState = Object.keys(states)[0];

  function consumeEvent(event) {
    const callback = states[currentState][event];
    if (callback) {
      callback(changeState);
      console.log(`Consumed event: [${machineName}::${currentState}::${event}]`);
    }
  }

  function changeState(name) {
    onStateExit(currentState);
    currentState = name;
    const newState = states[currentState];
    if (!newState) {
      throw new Error(`State not exists: ${name}`);
    }
    console.log(`Changed state to: [${machineName}::${name}]`);
    onStateEnter(currentState);
  }

  function onStateEnter(name) {
    const state = states[name];
    if (state._onEnter) {
      state._onEnter();
    }
  }

  function onStateExit(name) {
    const state = states[name];
    if (state._onExit) {
      state._onExit();
    }
  }

  return {
    consumeEvent,
    changeState,
  };
}
