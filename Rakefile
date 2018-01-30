if defined?(RSpec)
  require 'rspec/core/rake_task'
  RSpec::Core::RakeTask.new(:spec)
end

APP_RAKEFILE = File.expand_path("../spec/dummy/Rakefile", __FILE__)

load 'rails/tasks/engine.rake'
load 'rails/tasks/statistics.rake'

require 'bundler/gem_tasks'

namespace :assets do
  desc "Test precompiling assets through dummy application"
  task :precompile do
    Rake::Task['app:assets:precompile'].invoke
  end

  desc "Test cleaning assets through dummy application"
  task :clean do
    Rake::Task['app:assets:clean'].invoke
  end

  desc "Test clobbering assets through dummy application"
  task :clobber do
    Rake::Task['app:assets:clobber'].invoke
  end
end

task default: [:spec, 'app:jasmine:ci']
