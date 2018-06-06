require 'rails_helper'

describe "All components" do
  Dir.glob("app/views/govuk_publishing_components/components/*.erb").each do |filename|
    template = filename.split('/').last
    component_name = template.sub('_', '').sub('.html.erb', '')

    describe component_name do
      next if template.in?(%w[_govspeak.html.erb])

      yaml_file = "#{__dir__}/../../app/views/govuk_publishing_components/components/docs/#{component_name}.yml"

      it "is documented" do
        expect(File).to exist(yaml_file)
      end

      it "has the correct documentation" do
        yaml = YAML.load_file(yaml_file)

        expect(yaml["name"]).not_to be_nil
        expect(yaml["description"]).not_to be_nil
        expect(yaml["examples"]).not_to be_nil
        expect(yaml["accessibility_criteria"]).not_to be_nil
      end

      it "doesn't use `html_safe`" do
        file = File.read(filename)

        expect(file).not_to match 'html_safe'
      end
    end
  end
end
