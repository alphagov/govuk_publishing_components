# Vendored protobuf — `maestro_android.proto`

Direct copy of the protobuf schema served by `dev.mobile.maestro` on Android
devices, used by `@percy/core`'s element-region resolver to call
`maestro_android.MaestroDriver/viewHierarchy` directly over gRPC instead of
spawning the full `maestro` CLI (~9s JVM cold start per call → <100ms direct
gRPC call).

## Source

- **Upstream file:** `maestro-proto/src/main/proto/maestro_android.proto`
- **Upstream repo:** [`mobile-dev-inc/Maestro`](https://github.com/mobile-dev-inc/Maestro)
- **Commit SHA at copy time:** `bc8bde1b5cb7f2d4076047c0a9db094ece47512f` (2025-05-26)
- **Closest CLI release:** `cli-2.5.1`
- **Copy date:** 2026-04-29

## What we use

Only `MaestroDriver/viewHierarchy(ViewHierarchyRequest) returns (ViewHierarchyResponse)`
and the `string hierarchy = 1` field on the response. The rest of the proto
is included unchanged so future updates can be a clean upstream re-copy
without surgical edits.

## Drift policy

- The proto **must** be re-vendored from upstream whenever the Maestro CLI
  version deployed on BrowserStack hosts is bumped past the version recorded
  above. PRs that update this file must paste the upstream SHA and CLI tag.
- The runtime parser (`@grpc/proto-loader`) silently drops unknown fields.
  If `viewHierarchy`'s response field is renumbered, retyped, or replaced,
  decode errors surface as `dump-error (grpc-decode)` and a
  `maestroHierarchyDrift` flag appears on the `/percy/healthcheck` response.
  See `docs/solutions/integration-issues/percy-labels-cli-schema-rejection-2026-04-23.md`
  for context on why we monitor schema drift loudly.

## How to refresh

```sh
curl -fsSL "https://raw.githubusercontent.com/mobile-dev-inc/Maestro/main/maestro-proto/src/main/proto/maestro_android.proto" \
  -o packages/core/src/proto/maestro_android.proto
# Update the SHA + CLI tag above; PR must show the diff and the new pin.
```

The file is loaded at module init via `@grpc/proto-loader`'s `loadSync` from
`packages/core/src/maestro-hierarchy.js`. Babel CLI's `copyFiles: true`
(scripts/build.js:26) preserves the relative layout so it lands at
`dist/proto/maestro_android.proto` after `yarn build`.
