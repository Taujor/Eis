function eis (initialState){
  if (initialState === undefined) {
    console.error("[EIS] InitError: initialState cannot be undefined.");
    initialState = null;
  }
  
  let state = _isValidObject(initialState) ? _freeze(_clone(initialState)) : initialState;
  const listeners = new Set();
  
  function _freeze(object) {
    if (!_isValidObject(object)){
      console.error(`[EIS] TypeError: Unable to freeze object. Expected a plain object or array, got ${typeof object}.`, object);
      return object
    };
  
    Object.getOwnPropertyNames(object).forEach((key) => {
      const value = object[key];
      if (typeof value === "object" && value !== null) {
        _freeze(value);
      }
    });

    return Object.freeze(object);
  }

    
  function _clone(object){
    if(!_isValidObject(object)){
      return object
    }

    try {
      return JSON.parse(JSON.stringify(object));
    } catch (err) {
      console.error(
        `[EIS] CloneError: Object is not serializable. ` +
        `Only plain objects and arrays are supported. ` +
        `Received: ${typeof object}. ` +
        `Error: ${err.message}`
      );
    );

    return null;
  }
}
    
  function _isValidObject(object) {
    return object !== null && typeof object === "object";
  }

  function _notify() {
    listeners.forEach((listener) => {
      try {
        listener(state);
      } catch (err) {
        console.error(`[EIS] ListenerError: ${err.message}`);
      }
    });
  }
  
  function set (value){
    if(value === undefined){
      console.error(
        `[EIS] SetError: set() requires a new state value or an updater function. Received: ${typeof value}.`
      );

      return;
    }
    
    
    let next = typeof value === "function" ? value(state) : value;
    
    if (next === undefined) {
      console.warn("[EIS] NoOp: set() could not update state. Updater returned undefined.", );
      return;
    }
   
    if(Object.is(state, next)){
      console.warn(
        `[EIS] NoOp: set() was called, but the new state is the same reference as the current state. State was not updated.`
      );
      return;
    }
    
    if (_isValidObject(next)) {
      const cloned = _clone(next);
      if (cloned === null) {
        console.error("[EIS] SetError: Cannot set state due to non-serializable object.");
        return;
      }
      state = _freeze(cloned);
    } else {
      state = next;
    }
    
    _notify();
  }
    
  function get (){
    return state;
  }
    
  function subscribe (listener, instant = false){
    if (typeof listener !== "function") {
      console.error(
      `[EIS] Subscribe Error: Listener must be a function. ` +
      `Received: ${typeof listener}. Subscription was ignored.`
      );

      return () => {};
    }

    listeners.add(listener);

    if (instant) listener(state);

    return () => listeners.delete(listener);
  }
    
  return [
    get,
    set,
    subscribe
  ]
}

export default eis;
