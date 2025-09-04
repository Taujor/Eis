import assert from "assert";
import eis from "./eis.js";
console.log("Running EIS tests...");

// Utility to capture logs
function captureLogs(fn) {
  const errors = [];
  const warns = [];
  const origError = console.error;
  const origWarn = console.warn;

  console.error = (msg) => errors.push(msg);
  console.warn = (msg) => warns.push(msg);

  try {
    fn(errors, warns);
  } finally {
    console.error = origError;
    console.warn = origWarn;
  }

  return { errors, warns };
}

//
// 1. Initialization
//
{
  const [get] = eis({ a: 1 });
  assert.deepStrictEqual(get(), { a: 1 }, "Initial state should be set correctly");
}

{
  const logs = captureLogs(() => {
    const [get] = eis();
    assert.strictEqual(get(), null, "Undefined initial state should default to null");
  });
  assert.ok(
    logs.errors.some((m) => m.includes("InitError")),
    "InitError should log when initial state is undefined"
  );
}

//
// 2. get() and set() basics
//
{
  const [get, set] = eis({ count: 0 });
  set({ count: 1 });
  assert.deepStrictEqual(get(), { count: 1 }, "set() should replace state");
}

//
// 3. set() with updater function
//
{
  const [get, set] = eis({ count: 0 });
  set((s) => ({ count: s.count + 5 }));
  assert.strictEqual(get().count, 5, "Updater function should increment count");
}

//
// 4. Deep immutability
//
{
  const [get, set] = eis({ nested: { x: 1 }, arr: [{ y: 2 }] });
  set({ nested: { x: 2 }, arr: [{ y: 3 }] });
  const state = get();
  assert(Object.isFrozen(state), "State object should be frozen");
  assert(Object.isFrozen(state.nested), "Nested object should be frozen");
  assert(Object.isFrozen(state.arr), "Array should be frozen");
  assert(Object.isFrozen(state.arr[0]), "Nested array element should be frozen");
}

//
// 5. Subscription basics
//
{
  const [get, set, subscribe] = eis({ count: 0 });
  let called = 0;
  const unsubscribe = subscribe((s) => {
    called = s.count;
  });

  set({ count: 10 });
  assert.strictEqual(called, 10, "Subscriber should be called with updated state");

  unsubscribe();
  set({ count: 20 });
  assert.strictEqual(called, 10, "Unsubscribed listener should not be called");
}

//
// 6. Subscribe with instant flag
//
{
  const [get, , subscribe] = eis({ ready: true });
  let snapshot;
  subscribe((s) => {
    snapshot = s;
  }, true);
  assert.deepStrictEqual(snapshot, { ready: true }, "Instant subscriber should receive current state immediately");
}

//
// 7. set() with undefined value
//
{
  const [get, set] = eis("x");
  const logs = captureLogs(() => {
    set(undefined);
  });
  assert.strictEqual(get(), "x", "State should not change when set(undefined)");
  assert.ok(
    logs.errors.some((m) => m.includes("SetError")),
    "SetError should be logged when calling set(undefined)"
  );
}

//
// 8. set() updater returning undefined
//
{
  const [get, set] = eis(1);
  const logs = captureLogs(() => {
    set(() => undefined);
  });
  assert.strictEqual(get(), 1, "State should not change if updater returns undefined");
  assert.ok(
    logs.warns.some((m) => m.includes("NoOp")),
    "NoOp warning should be logged when updater returns undefined"
  );
}

//
// 9. Invalid subscribe
//
{
  const [, , subscribe] = eis(0);
  const logs = captureLogs(() => {
    const unsub = subscribe(123);
    assert.strictEqual(typeof unsub, "function", "Invalid subscribe should return noop function");
    unsub();
  });
  assert.ok(
    logs.errors.some((m) => m.includes("SubscribeError")),
    "SubscribeError should be logged when listener is invalid"
  );
}

//
// 10. Array state immutability
//
{
  const [get, set] = eis({ items: [] });
  set((s) => ({ items: [...s.items, "apple"] }));
  assert.deepStrictEqual(get().items, ["apple"], "Array should be updated immutably");

  const prev = get();
  set((s) => ({ items: [...s.items, "banana"] }));
  assert.deepStrictEqual(get().items, ["apple", "banana"], "Array should accumulate values");
  assert.deepStrictEqual(prev.items, ["apple"], "Previous state should remain unchanged");
}

//
// 11. NoOp on already frozen object
//
{
  const frozenFoo = Object.freeze({ bar: 1 });
  const [get, set] = eis(frozenFoo);
  const logs = captureLogs(() => {
    set(frozenFoo);
  });
  assert.ok(
    logs.warns.some((m) => m.includes("NoOp")),
    "NoOp warning should be logged when top-level object is already frozen"
  );
}

//
// 12. ListenerError when subscriber throws
//
{
  const [get, set, subscribe] = eis({ count: 0 });
  const logs = captureLogs(() => {
    subscribe(() => {
      throw new Error("boom");
    });
    set({ count: 1 });
  });
  assert.ok(logs.errors.some((m) => m.includes("ListenerError")), "ListenerError should be logged when subscriber throws");
}

//
// 13. CloneError with non-serializable (BigInt)
//
{
  let threw = false;
  try {
    eis({ big: BigInt(10) });
  } catch (err) {
    threw = true;
    assert.ok(err.message.includes("CloneError"), "CloneError should be thrown for non-serializable state");
  }
  assert.ok(threw, "Exception should have been thrown for BigInt");
}

//
// 14. FreezeError simulation
//
{
  const [get, set] = eis(42);
  const logs = captureLogs(() => {
    set(() => 42);
  });
  assert.strictEqual(get(), 42, "Primitive state should remain unchanged");
}

//
// 15. Strict mode disabled
//
{
  const [get, set] = eis({ a: 1 }, { strict: false });
  set({ a: 2 });
  assert.deepStrictEqual(get(), { a: 2 }, "Strict=false: state should update without freezing");
}

//
// 16. Updater function with strict=false
//
{
  const [get, set] = eis({ count: 1 }, { strict: false });
  set((s) => ({ count: s.count + 5 }));
  assert.strictEqual(get().count, 6, "Updater should work in strict=false");
}

//
// 17. Array edge cases
//
{
  const [get, set] = eis({ arr: [] }, { strict: true });
  set((s) => ({ arr: [...s.arr, 1] }));
  assert(Object.isFrozen(get().arr[0]), "Nested array element should be frozen in strict mode");
}

//
// 18. Non-serializable object (function)
//
{
  assert.throws(() => eis({ f: () => {} }), /CloneError/, "Function in state triggers CloneError");
}

//
// 19. Subscribe multiple times and remove
//
{
  const [get, set, subscribe] = eis({ val: 0 });
  let c = 0;
  const unsub1 = subscribe(() => c++);
  const unsub2 = subscribe(() => c++);
  set({ val: 1 });
  assert.strictEqual(c, 2, "Both subscribers called");
  unsub1();
  set({ val: 2 });
  assert.strictEqual(c, 3, "Only remaining subscriber called");
}

//
// 20. Primitive state update
//
{
  const [get, set] = eis(10, { strict: true });
  set(20);
  assert.strictEqual(get(), 20, "Primitive state should update without errors");
}

console.log("All tests passed!");

// --- BENCHMARKS ---
console.log("\nRunning benchmarks... (default)");

// Benchmark 1: 100k set/get cycles
const [gBM, sBM] = eis(null);
console.time("100k set/get");
for (let i = 0; i < 100_000; i++) {
  sBM(i);
  gBM();
}
console.timeEnd("100k set/get");

// Benchmark 2: 10k subscriptions
const [gBM2, sBM2, subBM2] = eis(null);
let callCount2 = 0;
console.time("10k subscribers");
for (let i = 0; i < 10_000; i++) {
  subBM2(() => callCount2++);
}
sBM2("bench");
console.timeEnd("10k subscribers");
assert.strictEqual(callCount2, 10_000, "All 10k subscribers should be called");

// Benchmark 3: 50k nested object updates
const [gBM3, sBM3] = eis(null);
console.time("50k nested object updates (3 levels deep)");
for (let i = 0; i < 50_000; i++) {
  sBM3({ deep: { nested: { index: i } } });
}
console.timeEnd("50k nested object updates (3 levels deep)");

console.log("Benchmarks completed!");

console.log("\nRunning benchmarks... (developer mode disabled)");

// Benchmark 4: 100k set/get cycles (developer mode disabled)
const [gBM4, sBM4] = eis(null, {dev: false});
console.time("100k set/get");
for (let i = 0; i < 100_000; i++) {
  sBM4(i);
  gBM4();
}
console.timeEnd("100k set/get");

// Benchmark 5: 10k subscriptions (developer mode disabled)
const [gBM5, sBM5, subBM5] = eis(null, {dev: false});
let callCount5 = 0;
console.time("10k subscribers");
for (let i = 0; i < 10_000; i++) {
  subBM5(() => callCount5++);
}
sBM5("bench");
console.timeEnd("10k subscribers");
assert.strictEqual(callCount5, 10_000, "All 10k subscribers should be called");

// Benchmark 6: 50k nested object updates (developer mode disabled)
const [gBM6, sBM6] = eis(null, {dev: false});
console.time("50k nested object updates (3 levels deep)");
for (let i = 0; i < 50_000; i++) {
  sBM6({ deep: { nested: { index: i } } });
}
console.timeEnd("50k nested object updates (3 levels deep)");

console.log("Benchmarks completed!");
