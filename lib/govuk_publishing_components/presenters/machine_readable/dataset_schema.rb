module GovukPublishingComponents
  module Presenters
    class DatasetSchema
      attr_reader :page

      def initialize(page)
        @page = page
      end

      def structured_data
        # http://schema.org/Dataset
        data = CreativeWorkSchema.new(@page).structured_data
          .merge(distribution)
          .merge(description)
          .merge(name)
        data["@type"] = "Dataset"
        data
      end

    private

      def distribution
        return {} unless page.attachments

        {
          "distribution" => page.attachments.map { |a| present_attachment(a.with_indifferent_access) }.compact,
        }
      end

      def description
        descr = page.body || page.description
        return {} unless descr

        {
          "description" => descr.slice(0..4999),
        }
      end

      def name
        {
          "name" => page.title,
        }
      end

      def present_attachment(attachment)
        title = attachment[:title]
        url = attachment[:url]
        return unless title
        return unless url

        case attachment[:attachment_type]
        when "external", "html"
          {
            "name" => title,
            "url" => url,
          }
        when "file"
          {
            "name" => title,
            "contentUrl" => url,
            "encodingFormat" => attachment[:content_type],
          }.compact
        end
      end
    end
  end
end
