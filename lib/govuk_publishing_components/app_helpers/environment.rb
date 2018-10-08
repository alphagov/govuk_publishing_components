module GovukPublishingComponents
  module AppHelpers
    class Environment
      GOVUK_ENVIRONMENTS = {
        "production" => "production",
        "staging" => "staging",
        "integration-blue-aws" => "integration",
      }.freeze

      # The "acceptance environment" we're in - not the same as Rails env.
      #
      # Can be "production", "staging", "integration", or "development"
      def self.current_acceptance_environment
        return "example" if ENV["HEROKU"]
        GOVUK_ENVIRONMENTS.fetch(ENV["ERRBIT_ENVIRONMENT_NAME"], "development")
      end
    end
  end
end
