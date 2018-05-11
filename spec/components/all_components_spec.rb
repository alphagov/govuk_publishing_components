require 'rails_helper'

describe "All components" do
  it "doesn't use `html_safe`" do
    files_with_html_safe = `grep -rni "html_safe" app/views/govuk_publishing_components/components`.lines

    expect(files_with_html_safe).to be_empty
  end
end
