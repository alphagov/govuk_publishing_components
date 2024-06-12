require "spec_helper"

RSpec.describe GovukPublishingComponents::AppHelpers::Environment do
  describe ".current_acceptance_environment" do
    it "returns development by default" do
      expect(environment_name_for(nil)).to eql("development")
      expect(environment_name_for("something-else")).to eql("development")
    end

    it "returns a listed environment when specified" do
      expect(environment_name_for("integration")).to eql("integration")
    end

    it "returns example when the Heroku environment variable is set" do
      expect(environment_name_for("heroku", environment_variable_name: "HEROKU")).to eql("example")
    end
  end

  def environment_name_for(actual_environment_name, environment_variable_name: "GOVUK_ENVIRONMENT")
    previous = ENV[environment_variable_name]
    ENV[environment_variable_name] = actual_environment_name
    name = GovukPublishingComponents::AppHelpers::Environment.current_acceptance_environment
    ENV[environment_variable_name] = previous
    name
  end
end
