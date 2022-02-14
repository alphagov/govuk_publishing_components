require "rubocop/rake_task"
require "rspec/core/rake_task"

APP_RAKEFILE = File.expand_path("spec/dummy/Rakefile", __dir__)

load "rails/tasks/engine.rake"
load "rails/tasks/statistics.rake"

rails_translation_manager = Gem::Specification.find_by_name("rails_translation_manager").gem_dir
load "#{rails_translation_manager}/lib/tasks/translation.rake"

require "bundler/gem_tasks"

RuboCop::RakeTask.new
RSpec::Core::RakeTask.new

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

desc "Linting for Ruby, JS and SASS"
task lint: %i[rubocop environment] do
  sh "yarn run lint"
end

desc "Jasmine"
task :jasmine do
  sh "yarn run jasmine"
end

task default: %i[lint spec jasmine]
