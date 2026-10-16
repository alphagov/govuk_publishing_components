# @percy/cli-doctor

> Percy CLI sub-command that diagnoses network, authentication, configuration, and CI readiness for running Percy builds.

---

## Installation

`@percy/cli-doctor` is bundled with `@percy/cli`. If you use the Percy CLI you already have it:

```sh
npx percy doctor
```

To install standalone:

```sh
npm install --save-dev @percy/cli-doctor
# or
yarn add --dev @percy/cli-doctor
```

---

## Usage

```
percy doctor [options]

Options:
  --proxy-server  <url>   Proxy server to test alongside direct connectivity
                          e.g. http://proxy.corp.example.com:8080
  --url           <url>   URL to open in Chrome for network activity analysis
                          (default: https://percy.io)
  --timeout       <ms>    Per-request timeout in milliseconds
                          (default: 10000, max: 300000)
  --quick                 Run only connectivity, SSL, and token auth checks
                          (~4 seconds instead of a full diagnostic run)
  --output-json   <path>  Write the full diagnostic report to a JSON file
  -v, --verbose           Show detailed debug output
  -h, --help              Show help
```

---

## What it checks

### 1 · Configuration Validation

Detects and validates Percy configuration files (`.percy.yml`, `.percy.yaml`, `percy.config.js`, etc.) via cosmiconfig:

- Reports file location and format
- Warns on missing or outdated `version` field (recommends version 2)
- Detects project-type/config mismatches (e.g., automate-only keys like `fullPage` used with a web token)

| Category | Meaning |
|---|---|
| `config_not_found` | No Percy config file detected |
| `config_found` | Config file located and loaded |
| `config_parse_error` | Config file has YAML/JSON syntax errors |
| `config_version_invalid` | `version` field is missing or non-numeric |
| `config_version_outdated` | Config uses an outdated version (< 2) |
| `config_key_automate_only` | Config contains Automate-only keys but token is not Automate |
| `config_key_web_only` | Config contains Web-only keys but token is not a Web token |

### 2 · CI Environment Detection

Detects your CI provider and validates CI-related settings:

- Identifies 10+ CI systems (GitHub Actions, GitLab CI, Jenkins, CircleCI, Travis, etc.)
- Validates git availability for commit/branch detection
- Checks parallel build configuration (`PERCY_PARALLEL_TOTAL` + `PERCY_PARALLEL_NONCE`)

| Category | Meaning |
|---|---|
| `ci_not_detected` | Not running in a CI environment |
| `ci_detected` | CI system identified |
| `ci_commit_missing` | Commit SHA could not be detected |
| `ci_commit_found` | Commit SHA available |
| `ci_branch_missing` | Branch name could not be detected |
| `ci_parallel_nonce_missing` | `PERCY_PARALLEL_TOTAL` set without `PERCY_PARALLEL_NONCE` |
| `ci_parallel_config_valid` | Both parallel env vars are set correctly |
| `ci_git_available` | Git repository detected |
| `ci_git_check_skipped` | Git check suppressed via `PERCY_SKIP_GIT_CHECK=true` |
| `ci_git_unavailable` | Git not installed or not in a git repository |

### 3 · Environment Variable Audit

Inventories all Percy-specific environment variables:

- Lists all set `PERCY_*` vars (names only — values are never exposed)
- Validates `PERCY_PARALLEL_TOTAL` is a positive integer
- Flags manual overrides (`PERCY_COMMIT`, `PERCY_BRANCH`, `PERCY_PULL_REQUEST`)
- Warns when `NODE_TLS_REJECT_UNAUTHORIZED=0` disables SSL validation

| Category | Meaning |
|---|---|
| `env_system_info` | OS, Node version, CPU, and RAM summary |
| `env_no_percy_vars` | No `PERCY_*` environment variables detected |
| `env_vars_listed` | Lists names of all set `PERCY_*` variables |
| `env_parallel_total_invalid` | `PERCY_PARALLEL_TOTAL` is not a valid positive integer |
| `env_manual_overrides` | Manual override vars active (e.g. `PERCY_COMMIT`, `PERCY_BRANCH`) |
| `env_tls_disabled` | `NODE_TLS_REJECT_UNAUTHORIZED=0` — SSL validation globally disabled |

### 4 · Network Connectivity

Probes each required Percy / BrowserStack domain:

| Domain | Purpose |
|---|---|
| `https://percy.io` | Percy API |
| `https://www.browserstack.com` | BrowserStack API |
| `https://hub.browserstack.com` | BrowserStack Automate |

Failure modes are classified as:

* **ENOTFOUND** → DNS resolution failure; suggest whitelisting on corporate DNS
* **ETIMEDOUT / ECONNRESET** → Firewall dropping packets; list CIDRs to whitelist
* **via proxy only** → Proxy required, suggests setting `HTTPS_PROXY`

### 5 · SSL / TLS

| Scenario | Outcome |
|---|---|
| `NODE_TLS_REJECT_UNAUTHORIZED=0` is set | **Warning** – SSL verification is disabled globally |
| SSL certificate error connecting to percy.io | **Fail** – likely a MITM proxy/VPN; suggests remediation |
| SSL handshake succeeds | **Pass** |

When a certificate error is detected, the command prints actionable suggestions
(contact network admin, add proxy cert to trust store, set `NODE_EXTRA_CA_CERTS`).

### 6 · Proxy Detection

Detects proxy configuration from (in priority order):

1. **Environment variables**: `HTTPS_PROXY`, `HTTP_PROXY`, `ALL_PROXY`, `NO_PROXY`
2. **macOS system proxy**: `scutil --proxy`, `networksetup -getautoproxyurl`
3. **Linux (GNOME)**: `gsettings org.gnome.system.proxy`
4. **Linux (/etc)**: `/etc/environment`
5. **Windows registry**: `HKCU\Software\Microsoft\Windows\CurrentVersion\Internet Settings`

Each discovered proxy is validated by attempting connections to percy.io and
browserstack.com through it.

### 7 · PAC / WPAD Auto-Proxy Configuration

Detects PAC file URLs from:

| Source | Detection method |
|---|---|
| macOS system | `networksetup -getautoproxyurl <interface>` |
| macOS plist | `/Library/Preferences/SystemConfiguration/preferences.plist` |
| Linux GNOME | `gsettings org.gnome.system.proxy autoconfig-url` |
| Windows | `HKCU\…\Internet Settings\AutoConfigURL` |
| Chrome / Chromium | `Default/Preferences` JSON (macOS, Linux, Windows) |
| Firefox | `~/.mozilla/firefox/*/prefs.js` (network.proxy.autoconfig_url) |

The PAC script is fetched and evaluated in a sandboxed Node.js `vm` context
using shims for all standard PAC helper functions. The result of
`FindProxyForURL("https://percy.io/", "percy.io")` is reported.

If a PAC file routes percy.io through a proxy the command surfaces the exact
`HTTPS_PROXY=…` export statement to add to your CI environment.

### 8 · Token Authentication

Validates the `PERCY_TOKEN` environment variable:

- **Presence**: Checks the token is set
- **Format**: Detects project type from token prefix (`web_`, `auto_`, `app_`, `ss_`, `vmw_`, `res_`) and suggests the correct CLI command
- **Authentication**: Makes a live API call to `percy.io/api/v1/tokens` to verify the token is valid (uses proxy if one was discovered in earlier checks)

Token values are **never** included in output — only the project type and pass/fail status.

| Category | Meaning |
|---|---|
| `token_missing` | `PERCY_TOKEN` is not set or is blank |
| `token_type_info` | Token prefix decoded — project type and suggested CLI command |
| `token_auth_pass` | Token authenticated successfully; role shown |
| `token_auth_fail` | Token rejected (HTTP 401 or 403) |
| `token_auth_unexpected_status` | Percy API returned an unexpected HTTP status |
| `token_auth_network_error` | Could not reach Percy API to validate token |
| `check_skipped` | Token validation skipped because percy.io is unreachable |

### 9 · Browser Network (Chrome CDP)

Launches headless Chrome to test end-to-end network connectivity through the browser process, including proxy and PAC resolution as Chrome would see it.

---

## Quick Mode

Use `--quick` to run only the essential checks (connectivity, SSL, and token auth) in ~4 seconds:

```sh
npx percy doctor --quick
```

This is useful for fast triage in CI pipelines or when you just want to verify your token and network are working.

---

## Auto-Doctor on Build Failure

Set `PERCY_AUTO_DOCTOR=true` to automatically run diagnostics when a Percy build fails:

```sh
export PERCY_AUTO_DOCTOR=true
npx percy exec -- your-test-command
```

When enabled, a build failure triggers a diagnostic run and prints actionable findings inline. This is opt-in and has no effect on successful builds.

---

## Example output

```
  Percy Doctor — diagnostic check

── Configuration
  ℹ Configuration file detected: /project/.percy.yml
  ✔ Config version: 2 (current)

── CI Environment
  ℹ CI system detected: GitHub Actions
  ✔ Git is available for commit detection.

── Environment Variables
  ℹ Percy environment variables set: PERCY_TOKEN, PERCY_PARALLEL_TOTAL

── SSL / TLS
  ✔ SSL handshake with percy.io succeeded (47ms).

── Network Connectivity
  ✔ Percy API is reachable directly (HTTP 200, 51ms).
  ✔ BrowserStack API is reachable directly (HTTP 200, 72ms).
  ✔ BrowserStack Automate is reachable directly (HTTP 200, 89ms).

── Proxy Configuration
  ℹ No proxy configuration detected in environment or system settings.

── PAC / Auto-Proxy Configuration
  ℹ No PAC (Proxy Auto-Configuration) file detected.

── Token Authentication
  ℹ Token detected (project type: web). Use `percy exec` to run snapshots.
  ✔ Token authentication successful.

── Browser Network
  ✔ Chrome loaded percy.io successfully.

  ✔ 8 passed · 0 warnings · 0 failures (4.2s)
```

---

## License

MIT
