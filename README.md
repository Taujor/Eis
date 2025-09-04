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
| `eis(null, {"dev": false})`        | Default exported function the first argument takes your inital state (uses `set`) and the second is an optional configuration object that can be used to set developer mode to false disabling freezing and cloning for better performance.                                                                       |
### Error Handling
- **Invalid Initial State**: Logs an `InitError` if `initialState` is undefined, defaulting to null.
- **Invalid Object Freeze**: Throws a `TypeError` if an invalid object (e.g., string, number, null) is passed to `_freeze`, expecting a plain object or array.
- **Non-serializable Object**: Throws a `CloneError` if an object or array cannot be cloned due to non-serializable data (e.g., functions, Date objects, circular references).
- **Undefined Set Value**: Logs a `SetError` if set is called with undefined.
- **Updater Returns Undefined**: Logs a `NoOp` warning if an updater function returns undefined.
- **Invalid Listener**: Logs a `SubscribeError` if a non-function is passed to subscribe, ignoring the subscription.

---
## Installation
```bash
npm install @taujor/eis
```
or
```bash
yarn add @taujor/eis
```
Via CDN:
```js
import eis from 'https://unpkg.com/@taujor/eis/eis.js'
```
Or include directly in your project:
```js
import eis from '@taujor/eis'
```

---
## Example
### JavaScript
```js
import eis from '@taujor/eis';
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
import eis from '@taujor/eis';
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
- **JSON Serializable Objects**: `JSON.parse(JSON.stringify(...))` does not handle non-serializable objects so for consistency non-serializable objects are also rejected when using `structuredClone`.
- **Performance Overhead**: Deep cloning and freezing can be slow for very large state objects. Try to keep them small or even better flat. Use multiple local stores instead of a single global store to achieve better performance. While still good practice this is now mitigated by setting developer mode to false to disable cloning/freezing in production like so `eis(null, {dev: false})`

---
## Upcoming Features
- **Documentation**: A documentation website for eis with tutorials, framework integration examples, and extensive technical documentation so everyone can use eis to its full potential.

---
## Contributing
Contributions are welcome! Please open an issue or submit a pull request.

---
## Working on something cool?
If you're using eis.js why not show off about it? Let everyone know in the dedicated [discussion](https://github.com/Taujor/Eis/discussions/1)
