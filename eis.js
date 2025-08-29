function eis(initialState) {
  if (initialState === undefined) {
    console.error("[EIS] InitError: initialState cannot be undefined, defaulting to null...");
    initialState = null;
  }
  
  const listeners = new Set();
  let state = _isValidObject(initialState) ? _freeze(_clone(initialState)) : initialState;

  function _isValidObject(object) {
    return object !== null && typeof object === "object";
  }

  function _isSerializable(value) {
    try {
      JSON.stringify(value);
      return true;
    } catch {
      return false;
    }
  }

  function _clone(object) {
    if (!_isValidObject(object)) return object;

    if (!_isSerializable(object)) {
      throw new Error("[EIS] CloneError: Only plain objects and arrays are supported.");
    }

    return typeof structuredClone === "function"
      ? structuredClone(object)
      : JSON.parse(JSON.stringify(object));
  }

  function _freeze(object) {
    if (!_isValidObject(object)) {
      throw new TypeError(
        `[EIS] FreezeError: Unable to freeze object. Expected a plain object or array, got ${typeof object}.`
      );
    }

    if (Object.isFrozen(object)) {
      console.warn("[EIS] NoOp: _freeze() object already frozen.");
      return object;
    }

    if (Array.isArray(object)) {
      for (let i = 0; i < object.length; i++) {
        const value = object[i];
        if (_isValidObject(value)) _freeze(value);
      }
    } else {
      const keys = Object.keys(object);
      for (const key of keys) {
        const value = object[key];
        if (_isValidObject(value)) _freeze(value);
      }
    }

    return Object.freeze(object);
  }

  function _notify() {
    listeners.forEach((listener) => {
      try {
        listener(state);
      } catch (err) {
        console.error(`[EIS] ListenerError: ${err.message || err}`);
      }
    });
  }

  function get() {
    return state;
  }

  function set(value) {
    if (value === undefined) {
      console.error(
        `[EIS] SetError: set() requires a new state value or an updater function. Received: ${typeof value}.`
      );
      return;
    }

    const next = typeof value === "function" ? value(_clone(state)) : value;

    if (next === undefined) {
      console.warn("[EIS] NoOp: set() updater returned undefined. State not updated.");
      return;
    }

    try {
      if (_isValidObject(next)) {
        state = _freeze(next);
      } else {
        state = next;
      }
    } catch (err) {
      console.error(err.message || err);
      return;
    }

    _notify();
  }

  function subscribe(listener, instant = false) {
    if (typeof listener !== "function") {
      console.error(
        `[EIS] SubscribeError: Listener must be a function. Received: ${typeof listener}.`
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
    subscribe,
  ];
}

export default eis;
