require 'rails_helper'

describe "All components" do
  Dir.glob("app/views/govuk_publishing_components/components/*.erb").each do |filename|
    template = filename.split('/').last

    describe template do
      next if template.in?(%w[_govspeak.html.erb])

      it "doesn't use `html_safe`" do
        file = File.read(filename)

        expect(file).not_to match 'html_safe'
      end
    end
  end
end
