# Specify the ruby version so Heroku can host the app
# But not in CI, since we test the gem against multiple ruby versions
ruby File.read(".ruby-version").strip unless ENV["CI"]

source "https://rubygems.org"

# Declare your gem's dependencies in govuk_publishing_components.gemspec.
# Bundler will treat runtime dependencies like base dependencies, and
# development dependencies will be added by default to the :development group.
gemspec

# Declare any dependencies that are still in development here instead of in
# your gemspec. These might include edge Rails or gems from your path or
# Git. Remember to move these dependencies to your gemspec before releasing
# your gem to rubygems.org.

# To use a debugger
# gem 'byebug', group: [:development, :test]
