module GovukPublishingComponents
  module Presenters
    class FaqPageSchema
      attr_reader :page

      def initialize(page)
        @page = page
      end

      def structured_data
        # http://schema.org/FAQPage
        data = CreativeWorkSchema.new(@page).structured_data
          .merge(main_entity)
        data["@type"] = "FAQPage"
        data
      end

    private

      def main_entity
        {
          "mainEntity" => questions_and_answers
        }
      end

      def questions_and_answers
        page.parts.each_with_index.map do |part, index|
          part_url = part_url(part, index)

          {
            "@type" => "Question",
            "name" => part['title'],
            "url" => part_url,
            "acceptedAnswer" => {
              "@type" => "Answer",
              "url" => part_url,
              "text" => part['body']
            }
          }
        end
      end

      def part_url(part, index)
        if index.zero?
          guide_url
        else
          guide_url + "/" + part["slug"]
        end
      end

      def guide_url
        Plek.new.website_root + page.base_path
      end
    end
  end
end
