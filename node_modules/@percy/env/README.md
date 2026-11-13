# @percy/env

This package provides various CI/CD support for Percy by coalescing different environment variables
into a common interface for consumption by `@percy/client`.

## Supported Environments

Auto-detected based on environment variables that the CI provider sets during a build.

- [AppVeyor](https://www.browserstack.com/docs/percy/ci-cd/appveyor)
- [Atlassian Bamboo](#supported-environments) (needs doc)
- [AWS CodeBuild](#supported-environments) (needs doc)
- [Azure Pipelines](https://www.browserstack.com/docs/percy/ci-cd/azure-pipelines)
- [Bitbucket Pipelines](https://www.browserstack.com/docs/percy/ci-cd/bitbucket-pipeline)
- [Bitrise](#supported-environments) (needs doc)
- [Buildkite](https://www.browserstack.com/docs/percy/ci-cd/buildkite)
- [CircleCI](https://www.browserstack.com/docs/percy/ci-cd/circleci)
- [Cloudflare Pages](#supported-environments) (needs doc)
- [Codemagic](#supported-environments) (needs doc)
- [Codeship](https://www.browserstack.com/docs/percy/ci-cd/codeship)
- [Drone CI](https://docs.percy.io/docs/drone)
- [GitHub Actions](https://www.browserstack.com/docs/percy/ci-cd/github-actions)
- [GitLab CI](https://www.browserstack.com/docs/percy/ci-cd/gitlab)
- [GoCD](#supported-environments) (needs doc)
- [Google Cloud Build](#supported-environments) (needs doc)
- [Harness CI](#supported-environments) (needs doc)
- [Heroku CI](#supported-environments) (needs doc)
- [Jenkins](https://www.browserstack.com/docs/percy/ci-cd/jenkins)
- [Jenkins PRB](https://www.browserstack.com/docs/percy/ci-cd/jenkins)
- [Netlify](https://www.browserstack.com/docs/percy/ci-cd/netlify)
- [Probo.CI](#supported-environments) (needs doc)
- [Semaphore](https://www.browserstack.com/docs/percy/ci-cd/semaphore)
- [TeamCity](#supported-environments) (needs doc)
- [Travis CI](https://www.browserstack.com/docs/percy/ci-cd/travis-ci)
- [Vercel](#vercel) — see note below
- [Woodpecker CI](#supported-environments) (needs doc)

## Opt-in Environments

Kubernetes-native pipelines do not inject provider-identifying environment variables
into step containers by default. To enable Percy detection on these systems, expose
the following variables via template substitution in your pipeline definition.

### Tekton Pipelines

```yaml
steps:
  - name: percy
    image: node:20
    env:
      - name: TEKTON_PIPELINE_RUN          # required — triggers detection
        value: "$(context.pipelineRun.name)"
      - name: TEKTON_COMMIT_SHA
        value: "$(params.commit-sha)"
      - name: TEKTON_BRANCH
        value: "$(params.branch)"
      - name: TEKTON_PULL_REQUEST          # optional
        value: "$(params.pr-number)"
```

### Argo Workflows

```yaml
- name: percy
  container:
    image: node:20
    env:
      - name: ARGO_WORKFLOW_NAME           # required — triggers detection
        value: "{{workflow.name}}"
      - name: ARGO_WORKFLOW_UID            # recommended — used as parallel nonce
        value: "{{workflow.uid}}"
      - name: ARGO_COMMIT_SHA
        value: "{{workflow.parameters.commit-sha}}"
      - name: ARGO_BRANCH
        value: "{{workflow.parameters.branch}}"
      - name: ARGO_PULL_REQUEST            # optional
        value: "{{workflow.parameters.pr-number}}"
```

### Vercel

Vercel exposes its `VERCEL_*` system environment variables to the build step only
when **Automatically expose System Environment Variables** is enabled on the project
(Settings → Environment Variables). Percy also needs `PERCY_PARALLEL_TOTAL=-1`
set in the project environment for the parallel nonce to populate from
`VERCEL_DEPLOYMENT_ID` — otherwise reruns of the same deploy will create separate
Percy builds instead of deduping.

## Percy Environment Variables

The following variables may be defined to override the respective derived CI environment variables.

```bash
PERCY_COMMIT          # build commit sha
PERCY_BRANCH          # build branch name
PERCY_PULL_REQUEST    # associated PR number
PERCY_PARALLEL_NONCE  # parallel nonce unique for this CI workflow
PERCY_PARALLEL_TOTAL  # total number of parallel shards
```

Additional Percy specific environment variable may be set to control aspects of your Percy build.

```bash
PERCY_TARGET_COMMIT   # percy target commit sha
PERCY_TARGET_BRANCH   # percy target branch name
PERCY_PARTIAL_BUILD   # if this build was marked as partial
```

## Adding Environment Support

1. Add CI detection to [`environment.js`](./src/environment.js)
2. Add respective environment variables
3. Add a dedicated CI test suite
4. Open a Pull Request!
