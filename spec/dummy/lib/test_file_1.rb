# this is a test file used to check component auditing functionality

thing = false
render("govuk_publishing_components/components/govspeak") { content.html_safe } unless thing
