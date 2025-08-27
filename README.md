# EIS ❄️ (Extremely Immutable State)

> A tiny, framework-agnostic state store for the web.  
> Simple, reactive, and immutable. Works with everything.

---

## Features

### Core Features
- **Immutable State**: State is always frozen to prevent accidental mutations.
- **Deep Freeze**: Recursively freezes all nested objects for deep immutability.
- **Deep Clone**: Uses `JSON.parse(JSON.stringify(...))` to ensure state updates are truly immutable.
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
| `subscribe((state => {)), false)` | Subscribes a listener function to state changes. Returns an unsubscribe function.              |

### Error Handling

- **Invalid Initial State**: Logs an `InitError` if `initialState` is undefined, defaulting to null.
- **Invalid Object Freeze**: Logs a `TypeError` if an invalid object (e.g., string, number, null) is passed to `_freeze`, expecting a plain object or array.
- **Non-serializable Object**: Logs a `CloneError` if an object or array cannot be cloned due to non-serializable data (e.g., functions, Date objects). Also logs a `SetError` if the state cannot be set due to non-serializable data.
- **Undefined Set Value**: Logs a `SetError` if set is called with undefined.
- **Updater Returns Undefined**: Logs a `NoOp` warning if an updater function returns undefined.
- **Same State Reference**: Logs a `NoOp` warning if set is called with the same state reference (checked via Object.is).
- **Invalid Listener**: Logs a `SubscribeError` if a non-function is passed to subscribe, ignoring the subscription.


---

## Installation

not currently available via npm/yarn:

```bash
npm install eis
# or
yarn add eis
```

Or include directly in your project:

```js
import eis from './eis.js'
```

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

## Use Cases

- **Simple State Management**: Ideal for small to medium sized web apps.
- **Immutable Data Flow**: Ensures data integrity by preventing direct state mutations.
- **Reactive UI Updates**: Works well with UI libraries for reactive updates.
- **Debugging**: Clear error messages help identify issues during development.
- **Testing**: Predictable state updates make testing straightforward.

## Limitations

- **No Circular References**: Cannot clone or freeze objects with circular references.
- **No Functions as State**: Functions stored in state will be lost during cloning.
- **No Symbols or Undefined** ```JSON.parse(JSON.stringify(...))``` does not handle ```Symbol``` or ```undefined``` values.
- **Performance Overhead**: Deep cloning and freezing can be slow for very large state objects. Try to keep them small or even better flat. Use multiple local stores instead of a single global store to achieve better performance.
- **No built-in state merging**: Currently no machinery exists to merge one state object into another automatically

## Upcoming Features

While eis is production ready this version is not my complete vision, there are many areas to improve upon. Here is a list of features I plan to add in the future.

- **Lazy cloning and freezing**: For better performance when manipulating large state objects making manipulating global or complex state performant with eis.
- **Automatic Merging**: a function by the name of `update` will be added to the api which instead of replacing state like set does will merge the given state into the current state.
- **Complex Object Support**: Full support for functions, date objects, maps, symbols, etc as state to facilitate more complex state management patterns.
- **Documentation**: I will create a documentation website for eis with tutorials, framework integration examples, and extensive documention so everyone can use eis to its full potential.

## Contributing
Contributions are welcome! Please open an issue or submit a pull request.
