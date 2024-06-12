module GovukPublishingComponents
  module AppHelpers
    class Environment
      GOVUK_ENVIRONMENTS = %w[integration staging production].freeze

      # The "acceptance environment" we're in - not the same as Rails env.
      # Can be "production", "staging", "integration", "development" or "example" (if running on Heroku)
      def self.current_acceptance_environment
        return "example" if ENV["HEROKU"]

        GOVUK_ENVIRONMENTS.include?(ENV["GOVUK_ENVIRONMENT"]) ? ENV["GOVUK_ENVIRONMENT"] : "development"
      end
    end
  end
end
