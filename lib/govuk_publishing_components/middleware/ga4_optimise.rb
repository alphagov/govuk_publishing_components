module GovukPublishingComponents
  module Middleware
    class Ga4Optimise
      DATA_GA4_REGEX = /data-ga4-(?:link|event|form)=("[^"]*")/

      def initialize(app)
        @app = app
      end

      def call(env)
        status, headers, response = @app.call(env)
        return [status, headers, safe_body_from_response(response)] unless headers["content-type"]&.start_with?("text/html")

        body = response.each.first
        matched_sections = body.scan(DATA_GA4_REGEX)

        if matched_sections.any?
          matched_sections.each do |section|
            body.sub!(section.first, section.first.gsub('"', "'").gsub("&quot\;", '"'))
          end
        end

        [status, headers, [body]]
      end

      def safe_body_from_response(response)
        return [response.body] if response.respond_to?(:body)

        response
      end
    end
  end
end
