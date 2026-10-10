# Deep-module packages

Copy this shape when adding a package:

```text
src/packages/<name>/
  index.ts       # public entry point
  client.ts      # optional additional public entry point
  server.ts      # optional additional public entry point
  lib/           # private implementation
  tests/         # private tests and fixtures
```

Import only through a package's entry points (its root files). Keep the interface small and the implementation deep. Discourage giant barrel files: expose several small root entry points when needed rather than re-exporting an entire subtree through one index.

- **Entry-point boundary:** app code and other packages may import only a package's root files, never its subfolders.
- **Intra-package freedom:** files within one package may import that package's implementation freely.
- **Tests through entry points:** tests may import public entry points and their own fixtures, but never implementation internals.
- **No cycles:** dependency cycles are errors.

Run `npm run lint:boundaries` to check the rules. Packages are flat: each immediate child of `src/packages/` is one package; a package cannot contain another package. Any subfolder is private, not only `lib/` and `tests/`.
