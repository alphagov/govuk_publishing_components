#!/usr/bin/env groovy

library("govuk")

node {
  govuk.buildProject(
    rubyLintDiff: false,
    beforeTest: {
      stage("Install yarn dependencies") {
        sh("yarn")
      }
      stage("Lint Javascript and SCSS") {
        sh("yarn run lint")
      }
    }
  )
}
