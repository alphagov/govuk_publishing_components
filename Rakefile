require 'rspec/core/rake_task'
RSpec::Core::RakeTask.new(:spec)

APP_RAKEFILE = File.expand_path("../test/dummy/Rakefile", __FILE__)

load 'rails/tasks/engine.rake'
load 'rails/tasks/statistics.rake'

require 'bundler/gem_tasks'
require 'rake/testtask'

Rake::TestTask.new(:test) do |t|
  t.libs << 'lib'
  t.libs << 'test'
  t.pattern = 'test/**/*_test.rb'
  t.verbose = false
end

namespace :assets do
  desc "Test precompiling assets through dummy application"

  task :precompile do |t|
    Rake::Task['app:assets:precompile'].invoke
  end

  task :clean do |t|
    Rake::Task['app:assets:clean'].invoke
  end
end

task default: [:spec, 'app:jasmine:ci']
