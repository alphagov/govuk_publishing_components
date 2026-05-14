# @percy/cli-build

Commands for interacting with Percy builds

## Commands
<!-- commands -->
* [`percy build:finalize`](#percy-buildfinalize)
* [`percy build:wait`](#percy-buildwait)
* [`percy build:id`](#percy-buildid)
* [`percy build:approve`](#percy-buildapprove)
* [`percy build:unapprove`](#percy-buildunapprove)
* [`percy build:reject`](#percy-buildreject)
* [`percy build:delete`](#percy-builddelete)

### `percy build:finalize`

Finalize parallel Percy builds

```
Usage:
  $ percy build:finalize [options]

Global options:
  -v, --verbose          Log everything
  -q, --quiet            Log errors only
  -s, --silent           Log nothing
  -l, --labels <string>  Associates labels to the build (ex: --labels=dev,prod )
  -h, --help             Display command help
```

### `percy build:wait`

Wait for a build to be finished

```
Usage:
  $ percy build:wait [options]

Options:
  -b, --build <id>       Build ID
  -p, --project <slug>   Build project slug, requires '--commit'
  -c, --commit <sha>     Build commit sha, requires '--project'
  -t, --timeout <ms>     Timeout before exiting without updates, defaults to 10 minutes
  -i, --interval <ms>    Interval at which to poll for updates, defaults to 10 second
  -f, --fail-on-changes  Exit with an error when diffs are found
  --pass-if-approved     Doesn't exit with an error if the build is approved, regardless of if
                         diffs are found.

Global options:
  -v, --verbose          Log everything
  -q, --quiet            Log errors only
  -s, --silent           Log nothing
  -l, --labels <string>  Associates labels to the build (ex: --labels=dev,prod )
  -h, --help             Display command help

Examples:
  $ percy build:wait --build 2222222
  $ percy build:wait --project org/project --commit HEAD
```

### `percy build:id`

Prints the build ID from a locally running Percy process

```
Usage:
  $ percy build:id [options]

Percy options:
  -P, --port [number]    Local CLI server port (default: 5338)

Global options:
  -v, --verbose          Log everything
  -q, --quiet            Log errors only
  -s, --silent           Log nothing
  -l, --labels <string>  Associates labels to the build (ex: --labels=dev,prod )
  -h, --help             Display command help
```

### `percy build:approve`

Approve Percy builds

```
Usage:
  $ percy build:approve [options] <build-id>

Arguments:
  build-id                       Build ID to approve

Options:
  --username <string>            Username for authentication (can also be set via
                                 BROWSERSTACK_USERNAME env var)
  --access-key <string>          Access key for authentication (can also be set via
                                 BROWSERSTACK_ACCESS_KEY env var)
  --pass-if-previously-approved  Does not exit with an error if the build has previous approvals

Global options:
  -v, --verbose                  Log everything
  -q, --quiet                    Log errors only
  -s, --silent                   Log nothing
  -l, --labels <string>          Associates labels to the build (ex: --labels=dev,prod )
  -h, --help                     Display command help

Examples:
  $ percy build:approve <build-id>
  $ percy build:approve <build-id> --username username --access-key **key**
  $ percy build:approve <build-id> --pass-if-previously-approved
```

### `percy build:unapprove`

Unapprove Percy builds

```
Usage:
  $ percy build:unapprove [options] <build-id>

Arguments:
  build-id               Build ID to approve

Options:
  --username <string>    Username for authentication (can also be set via BROWSERSTACK_USERNAME env
                         var)
  --access-key <string>  Access key for authentication (can also be set via BROWSERSTACK_ACCESS_KEY
                         env var)

Global options:
  -v, --verbose          Log everything
  -q, --quiet            Log errors only
  -s, --silent           Log nothing
  -l, --labels <string>  Associates labels to the build (ex: --labels=dev,prod )
  -h, --help             Display command help

Examples:
  $ percy build:unapprove <build-id>
  $ percy build:unapprove <build-id> --username username --access-key **key**
```

### `percy build:reject`

Reject Percy builds

```
Usage:
  $ percy build:reject [options] <build-id>

Arguments:
  build-id               Build ID to approve

Options:
  --username <string>    Username for authentication (can also be set via BROWSERSTACK_USERNAME env
                         var)
  --access-key <string>  Access key for authentication (can also be set via BROWSERSTACK_ACCESS_KEY
                         env var)

Global options:
  -v, --verbose          Log everything
  -q, --quiet            Log errors only
  -s, --silent           Log nothing
  -l, --labels <string>  Associates labels to the build (ex: --labels=dev,prod )
  -h, --help             Display command help

Examples:
  $ percy build:reject <build-id>
  $ percy build:reject <build-id> --username username --access-key **key**
```

### `percy build:delete`

Delete Percy builds

```
Usage:
  $ percy build:delete [options] <build-id>

Arguments:
  build-id               Build ID to approve

Options:
  --username <string>    Username for authentication (can also be set via BROWSERSTACK_USERNAME env
                         var)
  --access-key <string>  Access key for authentication (can also be set via BROWSERSTACK_ACCESS_KEY
                         env var)

Global options:
  -v, --verbose          Log everything
  -q, --quiet            Log errors only
  -s, --silent           Log nothing
  -l, --labels <string>  Associates labels to the build (ex: --labels=dev,prod )
  -h, --help             Display command help

Examples:
  $ percy build:delete <build-id>
  $ percy build:delete <build-id> --username username --access-key **key**
```
<!-- commandsstop -->
