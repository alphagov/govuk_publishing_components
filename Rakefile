begin
  require "rspec/core/rake_task"
  RSpec::Core::RakeTask.new(:spec)
rescue LoadError
  puts "Running in production mode"
end

APP_RAKEFILE = File.expand_path("spec/dummy/Rakefile", __dir__)

load "rails/tasks/engine.rake"
load "rails/tasks/statistics.rake"

require "bundler/gem_tasks"

namespace :assets do
  desc "Test precompiling assets through dummy application"
  task :precompile do
    Rake::Task["app:assets:precompile"].invoke
  end

  desc "Test cleaning assets through dummy application"
  task :clean do
    Rake::Task["app:assets:clean"].invoke
  end

  desc "Test clobbering assets through dummy application"
  task :clobber do
    Rake::Task["app:assets:clobber"].invoke
  end
end

desc "Run RuboCop linting"
task lint_ruby: :environment do
  sh "bundle exec rubocop --format clang"
end

desc "Run Javascript and Sass linting"
task lint_js_and_sass: :environment do
  sh "yarn run lint"
end

task default: [:lint_ruby, :lint_js_and_sass, :spec, "app:jasmine:ci"]
