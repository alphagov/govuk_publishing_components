require 'rails_helper'

describe "All components" do
  Dir.glob("app/views/govuk_publishing_components/components/*.erb").each do |filename|
    template = filename.split('/').last
    component_name = template.sub('_', '').sub('.html.erb', '')

    describe component_name do
      next if template.in?(%w[_govspeak.html.erb])

      it "is documented" do
        yaml_file = "#{__dir__}/../../app/views/govuk_publishing_components/components/docs/#{component_name}.yml"

        expect(File).to exist(yaml_file)
      end

      it "doesn't use `html_safe`" do
        file = File.read(filename)

        expect(file).not_to match 'html_safe'
      end
    end
  end
end
