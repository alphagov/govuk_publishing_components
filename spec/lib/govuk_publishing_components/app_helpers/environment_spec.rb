require "spec_helper"

RSpec.describe GovukPublishingComponents::AppHelpers::Environment do
  describe ".current_acceptance_environment" do
    it "returns development by default" do
      expect(environment_name_for(nil)).to eql("development")
      expect(environment_name_for("something-else")).to eql("development")
    end

    it "returns integration as well" do
      expect(environment_name_for("integration-blue-aws")).to eql("integration")
    end
  end

  def environment_name_for(actual_environment_name)
    previous = ENV["ERRBIT_ENVIRONMENT_NAME"]
    ENV["ERRBIT_ENVIRONMENT_NAME"] = actual_environment_name
    name = GovukPublishingComponents::AppHelpers::Environment.current_acceptance_environment
    ENV["ERRBIT_ENVIRONMENT_NAME"] = previous
    name
  end
end
