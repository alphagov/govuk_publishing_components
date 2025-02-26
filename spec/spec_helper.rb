require "simplecov"
SimpleCov.start "rails" do
  enable_coverage :branch
end

require "webmock/rspec"
require "govuk_publishing_components"
require "govuk_schemas"
require_relative "support/components_helper"
require "gds_api/test_helpers/content_store"
require "faker"

if ENV["USE_I18N_COVERAGE"]
  require "i18n/coverage"
  require "i18n/coverage/printers/file_printer"
  I18n::Coverage.config.printer = I18n::Coverage::Printers::FilePrinter
  I18n::Coverage.start
end

WebMock.disable_net_connect!(allow_localhost: true)

RSpec.configure do |config|
  config.example_status_persistence_file_path = "tmp/failures.txt"

  config.filter_run_excluding not_applicable: true, visual_regression: true

  config.expect_with :rspec do |expectations|
    # This option will default to `true` in RSpec 4. It makes the `description`
    # and `failure_message` of custom matchers include text for helper methods
    # defined using `chain`, e.g.:
    #     be_bigger_than(2).and_smaller_than(4).description
    #     # => "be bigger than 2 and smaller than 4"
    # ...rather than:
    #     # => "be bigger than 2"
    expectations.include_chain_clauses_in_custom_matcher_descriptions = true
  end

  config.mock_with :rspec do |mocks|
    # Prevents you from mocking or stubbing a method that does not exist on
    # a real object. This is generally recommended, and will default to
    # `true` in RSpec 4.
    mocks.verify_partial_doubles = true
  end

  # This option will default to `:apply_to_host_groups` in RSpec 4 (and will
  # have no way to turn it off -- the option exists only for backwards
  # compatibility in RSpec 3). It causes shared context metadata to be
  # inherited by the metadata hash of host groups and examples, rather than
  # triggering implicit auto-inclusion in groups with matching metadata.
  config.shared_context_metadata_behavior = :apply_to_host_groups

  config.before do |example|
    # Visual regression tests need the JS driver to be used for screenshots
    Capybara.current_driver = Capybara.javascript_driver if example.metadata[:visual_regression]
  end
end
