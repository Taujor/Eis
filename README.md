# Eis ❄️

> A tiny, framework-agnostic state store for the web.  
> Simple, reactive, and immutable. Works with Vanilla JS, React, Vue, and Svelte.

---

## Features

- ⚡ **Lightweight** – just a few lines of code.
- 🔄 **Reactive** – automatic updates on state changes.
- 🧊 **Immutable by default** – prevents accidental mutations.
- 🌍 **Framework-agnostic** – works everywhere: Vanilla JS, React, Vue, Svelte.
- 🎯 **Simple API** – no boilerplate, just state.

---

## Installation

### Via CDN

```js
<script type="module">
  import eis from "https://unpkg.com/eis@latest/eis.js";
</script>
```

## Usage

### JavaScript

```js
import Eis from "eis.js";

// create store with initial state
const count = new Eis({ value: 0 });

// subscribe to state changes
count.subscribe(state => {
  console.log("Count is now:", state.value);
});

// update state
count.set(state => {
  state.value += 1;
});
```

### React

```jsx
import React, { useEffect, useState } from "react";
import eis from "eis.js";

const store = eis({ count: 0 });

export default function Counter() {
  const [count, setCount] = useState(store.get().count);

  useEffect(() => {
    return store.subscribe(state => setCount(state.count));
  }, []);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => store.set(s => { s.count++; })}>
        Increment
      </button>
    </div>
  );
}

```

## API

Creates a new store.
```js
const store = new Eis("any json serializable object or primitive value"); 
```

Returns the current state.
```js
store.get()
```

Applies an update function or assigns a new value. The updater receives a cloned state object to mutate.
```js
store.set(update)
```

Registers a callback that runs whenever state changes and returns an unsubscribe function.
```js
const unsubscribe = store.subscribe(listener)
```

🧊 Why "Eis"?

"Eis" means ice in German (pronounced the same) – solid and immutable, but is liquid and malleable to work with.
This library is built to be the same: frozen in design, flexible in use.
