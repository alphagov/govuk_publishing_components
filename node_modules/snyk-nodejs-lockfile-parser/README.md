![Snyk logo](https://snyk.io/style/asset/logo/snyk-print.svg)

---

[![Known Vulnerabilities](https://snyk.io/test/github/snyk/nodejs-lockfile-parser/badge.svg)](https://snyk.io/test/github/snyk/nodejs-lockfile-parser)

Snyk helps you find, fix and monitor for known vulnerabilities in your dependencies, both on an ad hoc basis and as part of your CI (Build) system.

## Snyk Node.js Lockfile Parser

This is a small utility package that parses lock file and returns either a [dependency tree](https://github.com/snyk/nodejs-lockfile-parser/blob/1a495302089614205478d57611bf7c39d29ce66d/lib/parsers/index.ts#L51) or a [dependency graph](https://github.com/snyk/dep-graph). Dependency graphs are the more modern data type and we plan to migrate fully over.

Dep graph generation supported for:

- `package-lock.json` (at Versions 2 and 3)
- `yarn.lock`
- `pnpm-lock.yaml` (lockfileVersion 5.x, 6.x and 9.x)

Legacy dep tree supported for:

- `package-lock.json`
- yarn 1 `yarn.lock`
- yarn 2 `yarn.lock`
