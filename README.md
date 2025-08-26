# Eis ❄️

> A tiny, framework-agnostic state store for the web.  
> Simple, reactive, and immutable. Works with everything.

---

# EIS (Extremely Immutable State)

A lightweight, immutable state management library for JavaScript applications.

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
| `set(value)`   | Updates the state. Accepts either a new state or an updater function.                           |
| `subscribe(l)` | Subscribes a listener function to state changes. Returns an unsubscribe function.              |

### Error Handling
- **Invalid Object Freeze**: Logs an error if an invalid object is passed to `_freeze`.
- **Non-serializable Object**: Logs an error if an object cannot be cloned.
- **Undefined Set Value**: Logs an error if `set` is called with `undefined`.
- **Updater Returns Undefined**: Logs a warning if an updater function returns `undefined`.
- **Same State Reference**: Logs a warning if `set` is called with the same state reference.
- **Invalid Listener**: Logs an error if a non-function is passed to `subscribe`.

---

## Installation

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

## Use Cases

*Simple State Management*: Ideal for small to medium sized web apps.
*Immutable Data Flow*: Ensures data integrity by preventing direct state mutations.
*Reactive UI Updates*: Works well with UI libraries for reactive updates.
*Debugging*: Clear error messages help identify issues during development.
*Testing*: Predictable state updates make testing straightforward.

## Limitations

*No Circular References*: Cannot clone or freeze objects with circular references.
*No Functions as State*: Functions stored in state will be lost during cloning.
*No Symbols or Undefined* ```JSON.parse(JSON.stringify(...))``` does not handle ```Symbol``` or ```undefined``` values.
*Performance Overhead*: Deep cloning and freezing can be slow for very large state objects.
*No built-in state merging*: Currently no machinery exists to merge one state object into another automatically

## Contributing
Contributions are welcome! Please open an issue or submit a pull request.
