require 'test_helper'
require 'govuk-content-schema-test-helpers'

GovukContentSchemaTestHelpers.configure do |config|
  config.schema_type = 'frontend'
  config.project_root = Rails.root
end

class ComponentTestCase < ActionView::TestCase
  def component_name
    raise NotImplementedError, "Override this method in your test class"
  end

  def render_component(locals)
    render file: "components/_#{component_name}", locals: locals
  end

  def assert_definition(term, definition)
    assert_select "dt", text: term
    assert_select "dd", text: definition
  end

  def assert_link(link)
    assert_select "a[href=\"#{link}\"]"
  end

  def assert_link_with_text(link, text)
    assert_select "a[href=\"#{link}\"]", text: text
  end

  def assert_link_with_text_in(selector, link, text)
    assert_select "#{selector} a[href=\"#{link}\"]", text: text
  end

  def assert_timestamp_in(selector, timestamp, text)
    assert_select "#{selector} time[datetime=\"#{timestamp}\"]", text: text
  end

  def assert_tracking_link(name, value, total = 1)
    assert_select "a[data-track-#{name}='#{value}']", total
  end
end
