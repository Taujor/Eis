## Changelog

### v1.1.3
- **New**: Added `dev` mode toggle to skip deep cloning and freezing for improved performance in production.
- **New** Added test.js which contains tests and performance benchmarks.
- **Improvement**: `_clone` and `_freeze` now respect the `dev` flag, returning the object directly when disabled.
- **Improvement**: Default `dev` mode is `true` to preserve previous behavior (strict immutability) unless explicitly disabled.
- **Fix**: Removed unnecessary CloneError test for `Date` objects; now any JSON-serializable value is accepted as state.
- **Improvement**: Simplified `_clone` and `_freeze` checks when `dev` mode is disabled, reducing overhead for high-frequency state updates.


### v1.0.0
- **New**: Added `_isSerializable` helper for better error handling.
- **New**: Uses `structuredClone` if available, falls back to JSON methods.
- **Fix**: `_freeze` now properly handles arrays and already frozen objects.
- **Improvement**: `_freeze` does not attempt to freeze top-level or nested primitive data types in objects or arrays.
- **Improvement**: `set` now passes a cloned state to updater functions (no need to spread state into a new object before returning from updater functions).
- **Improvement**: More descriptive error messages and logging.
- **Improvement**: Throws errors for invalid objects in `_freeze` and `_clone`.
