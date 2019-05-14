#!/usr/bin/env groovy

library("govuk")

node {
  govuk.buildProject(
    rubyLintDiff: false,
    beforeTest: {
      stage("Install npm dependencies") {
        sh("npm install")
      }
      stage("Lint Javascript and SCSS") {
        sh("npm run lint")
      }
    }
  )
}
