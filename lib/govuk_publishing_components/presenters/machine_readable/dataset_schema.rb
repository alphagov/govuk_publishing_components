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
          .merge(description)
          .merge(name)
        data["@type"] = "Dataset"
        data
      end

    private

      def description
        {
          "description" => (page.body || page.description).slice(0..4999)
        }
      end

      def name
        {
          "name" => page.title
        }
      end
    end
  end
end
