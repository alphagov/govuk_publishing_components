require "rails_helper"

describe "All components" do
  Dir.glob("app/views/govuk_publishing_components/components/*.erb").each do |filename|
    template = filename.split("/").last
    component_name = template.sub("_", "").sub(".html", "").sub(".erb", "").gsub("-", "_")

    describe component_name do
      yaml_file = "#{__dir__}/../../app/views/govuk_publishing_components/components/docs/#{component_name}.yml"

      it "is documented" do
        expect(File).to exist(yaml_file)
      end

      it "has the correct documentation" do
        yaml = YAML.load_file(yaml_file, aliases: true, permitted_classes: [Symbol, Time])

        expect(yaml["name"]).not_to be_nil
        expect(yaml["description"]).not_to be_nil
        expect(yaml["examples"]).not_to be_nil
        expect(
          yaml["accessibility_criteria"] || yaml["shared_accessibility_criteria"],
        ).not_to be_nil
      end

      it "has the correct class in the ERB template",
         skip: component_name.in?(%w[step_by_step_nav_related step_by_step_nav_header step_by_step_nav previous_and_next_navigation]),
         not_applicable: component_name.in?(%w[meta_tags machine_readable_metadata google_tag_manager_script table]) do
        erb = File.read(filename)

        class_name = "gem-c-#{component_name.dasherize}"

        expect(erb).to match(class_name), class_name
      end

      it "has a correctly named template file" do
        template_file = "#{__dir__}/../../app/views/govuk_publishing_components/components/_#{component_name}.html.erb"

        expect(File).to exist(template_file)
      end

      it "has a correctly named spec file" do
        rspec_file = "#{__dir__}/../../spec/components/#{component_name.tr('-', '_')}_spec.rb"

        expect(File).to exist(rspec_file)
      end

      it "has a correctly named SCSS file", not_applicable: component_name.in?(%w[contextual_breadcrumbs contextual_footer contextual_sidebar google_tag_manager_script list machine_readable_metadata meta_tags]) do
        css_file = "#{__dir__}/../../app/assets/stylesheets/govuk_publishing_components/components/_#{component_name.tr('_', '-')}.scss"

        expect(File).to exist(css_file)
      end

      it "doesn't use `html_safe`", not_applicable: component_name.in?(%w[govspeak]) do
        file = File.read(filename)

        expect(file).not_to match "html_safe"
      end
    end
  end
end
