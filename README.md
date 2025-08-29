[![Sponsor](https://img.shields.io/badge/Sponsor-GitHub-181717?style=flat&logo=GitHub)](https://github.com/sponsors/taujor)
# EIS ❄️ (Extremely Immutable State)
> A tiny, framework-agnostic state store for the web.
> Simple, reactive, and immutable. Works with everything.

---
## Features
### Core Features
- **Immutable State**: State is always frozen to prevent accidental mutations.
- **Deep Freeze**: Recursively freezes all nested objects for deep immutability.
- **Deep Clone**: Uses `structuredClone` if available, falls back to `JSON.parse(JSON.stringify(...))` to ensure state updates are truly immutable.
- **Simple API**: Only three methods: `get`, `set`, and `subscribe`.
- **Functional Updates**: Supports both direct value updates and updater functions.
- **Change Detection**: Only updates and notifies listeners if the new state is a different reference.
- **Subscription Model**: Listen to state changes and react accordingly.
- **Instant Notification**: Optionally call listeners immediately with the current state.
- **Unsubscribe Support**: Easily remove listeners when no longer needed.
- **Clear Error Handling**: Provides actionable error messages for debugging.
- **No External Dependencies**: Self-contained, minimalistic, and easy to integrate.

### API Methods
| Method         | Description                                                                                     |
|----------------|-------------------------------------------------------------------------------------------------|
| `get()`        | Returns the current state.                                                                       |
| `set((state) => {})` or `set(value)`   | Replaces the state. Accepts either a new state or an updater function that returns new state.                           |
| `subscribe((state => {})), false)` | Subscribes a listener function to state changes. Returns an unsubscribe function. Setting false to true will run the listener instantly.             |

### Error Handling
- **Invalid Initial State**: Logs an `InitError` if `initialState` is undefined, defaulting to null.
- **Invalid Object Freeze**: Throws a `TypeError` if an invalid object (e.g., string, number, null) is passed to `_freeze`, expecting a plain object or array.
- **Non-serializable Object**: Throws a `CloneError` if an object or array cannot be cloned due to non-serializable data (e.g., functions, Date objects, circular references).
- **Undefined Set Value**: Logs a `SetError` if set is called with undefined.
- **Updater Returns Undefined**: Logs a `NoOp` warning if an updater function returns undefined.
- **Invalid Listener**: Logs a `SubscribeError` if a non-function is passed to subscribe, ignoring the subscription.

---
## Installation
Not currently available via npm/yarn:
```bash
npm install eis
# or
yarn add eis
```
Or include directly in your project:
```js
import eis from './eis.js'
```

---
## Example
### JavaScript
```js
import eis from 'eis';
const [get, set, subscribe] = eis({ count: 0 });
// Subscribe to state changes
const unsubscribe = subscribe((state) => {
  console.log('State changed:', state);
}, true);
// Update state
set({ count: 1 });
// Logs: State changed: { count: 1 }
set((state) => ({ count: state.count + 1 }));
// Logs: State changed: { count: 2 }
// Get current state
console.log(get());
// { count: 2 }
// Unsubscribe
unsubscribe();
```

### React
```jsx
import { useEffect, useState } from 'react';
import eis from './eis.js';
// Initialize the state store with a number
const [get, set, subscribe] = eis(0);
function Counter() {
  // Use React state to trigger re-renders
  const [count, setCount] = useState(get());
  // Subscribe to eis state changes
  useEffect(() => {
    const unsubscribe = subscribe((newState) => {
      console.log('Count:', newState);
      setCount(newState); // Update React state
    }, true); // Immediate invocation to sync initial state
    return unsubscribe; // Cleanup on unmount
  }, []);
  return (
    <div style={{ padding: '20px' }}>
      <h1>Simple Counter</h1>
      <p>Count: {count}</p>
      <button
        onClick={() => set((state) => state + 1)}
        style={{ marginRight: '10px' }}
      >
        Increment
      </button>
      <button
        onClick={() => set((state) => state - 1)}
      >
        Decrement
      </button>
    </div>
  );
}
export default Counter;
```

---
## Use Cases
- **Simple State Management**: Ideal for small to medium sized web apps.
- **Immutable Data Flow**: Ensures data integrity by preventing direct state mutations.
- **Reactive UI Updates**: Works well with UI libraries for reactive updates.
- **Backend Task Scheduling & Caching**: Useful for caching API requests or batching background jobs.
- **Debugging**: Clear error messages help identify issues during development.
- **Testing**: Predictable state updates make testing straightforward.

---
## Limitations
- **No Circular References**: Cannot clone or freeze objects with circular references. Results in a `CloneError` or `FreezeError`.
- **No Functions as State**: Functions stored in state will throw a `CloneError` during cloning.
- **No Symbols or Undefined**: `JSON.parse(JSON.stringify(...))` does not handle `Symbol` or `undefined` values so for consistency non-serializable objects like this are also be rejected when using `structuredClone`.
- **Performance Overhead**: Deep cloning and freezing can be slow for very large state objects. Try to keep them small or even better flat. Use multiple local stores instead of a single global store to achieve better performance.
- **No Built-in State Merging**: Currently no machinery exists to merge one state object into another automatically.

---
## Upcoming Features
- **Lazy cloning and freezing**: For better performance when manipulating large state objects making manipulating global or complex state performant with eis.
- **Automatic Merging**: A function by the name of `update` will be added to the API which instead of replacing state like set does will merge the given state into the current state.
- **Documentation**: A documentation website for eis with tutorials, framework integration examples, and extensive technical documentation so everyone can use eis to its full potential.

---
## Changelog

### v1.0.0 (Latest)
- **New**: Added `_isSerializable` helper for better error handling.
- **New**: Uses `structuredClone` if available, falls back to JSON methods.
- **Fix**: `_freeze` now properly handles arrays and already frozen objects.
- **Improvement**: `_freeze` does not attempt to freeze top-level or nested primitive data types in objects or arrays.
- **Improvement**: `set` now passes a cloned state to updater functions (no need to spread state into a new object before returning from updater functions).
- **Improvement**: More descriptive error messages and logging.
- **Improvement**: Throws errors for invalid objects in `_freeze` and `_clone`.

---
## Contributing
Contributions are welcome! Please open an issue or submit a pull request.
