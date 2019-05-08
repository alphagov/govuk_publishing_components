module GovukPublishingComponents
  module Presenters
    class Attachment
      include ActionView::Helpers::NumberHelper
      include ActionView::Helpers::TextHelper

      attr_reader :attachment_data

      # Expects a hash of attachment data
      # * title and url are required
      # * content_type, filename, file_size, number of pages can be provided
      def initialize(attachment_data)
        @attachment_data = attachment_data.with_indifferent_access
      end

      def title
        attachment_data.fetch(:title)
      end

      def url
        attachment_data.fetch(:url)
      end

      def content_type
        @content_type ||= SupportedContentType.find(
          attachment_data[:content_type],
          attachment_data[:filename] ? File.extname(attachment_data[:filename]) : nil,
        )
      end

      def content_type_abbr
        content_type.abbr
      end

      def readable_content_type
        content_type.name
      end

      def readable_file_size
        return unless attachment_data[:file_size]

        number_to_human_size(attachment_data[:file_size])
      end

      def readable_number_of_pages
        return unless attachment_data[:number_of_pages]

        pluralize(attachment_data[:number_of_pages], "page")
      end

      def thumbnail
        "https://www.gov.uk/government/assets/pub-cover-doc-afe3b0a8a9511beeca890340170aee8b5649413f948e512c9b8ce432d8513d32.png"
      end

      def opendocument?
        content_type.opendocument?
      end

      class SupportedContentType
        attr_reader :content_type, :name, :abbr

        TYPES = [
          { content_type: "application/msword", name: "MS Word Document" }.freeze, # doc
          { content_type: "application/pdf", abbr: "PDF", name: "Portable Document Format" }.freeze,
          { content_type: "application/postscript", extension: ".ps", abbr: "PS", name: "PostScript" }.freeze,
          { content_type: "application/postscript", extension: ".eps", abbr: "EPS", name: "Encapsulated PostScript" }.freeze,
          { content_type: "application/rtf", abbr: "RTF", name: "Rich Text Format" }.freeze,
          { content_type: "application/vnd.ms-excel", name: "MS Excel Spreadsheet" }.freeze,
          { content_type: "application/vnd.ms-excel.sheet.macroenabled.12", abbr: "XLSM", name: "MS Excel Macro-Enabled Workbook" }.freeze,
          { content_type: "application/vnd.ms-powerpoint", name: "MS Powerpoint Presentation" }.freeze, # ppt
          { content_type: "application/vnd.oasis.opendocument.presentation", abbr: "ODP", name: "OpenDocument Presentation" }.freeze,
          { content_type: "application/vnd.oasis.opendocument.spreadsheet", abbr: "ODS", name: "OpenDocument Spreadsheet" }.freeze,
          { content_type: "application/vnd.oasis.opendocument.text", abbr: "ODT", name: "OpenDocument Text document" }.freeze,
          { content_type: "application/vnd.openxmlformats-officedocument.presentationml.presentation", name: "MS Powerpoint Presentation" }.freeze, # pptx
          { content_type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", name: "MS Excel Spreadsheet" }.freeze, # xlsx
          { content_type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document", name: "MS Word Document" }.freeze, # docx
          { content_type: "application/xml", abbr: "XML", name: "XML Document" }.freeze,
          { content_type: "image/gif", abbr: "GIF", name: "Graphics Interchange Format" }.freeze,
          { content_type: "image/jpeg", name: "JPEG" }.freeze,
          { content_type: "image/png", abbr: "PNG", name: "Portable Network Graphic" }.freeze,
          { content_type: "image/vnd.dxf", abbr: "DXF", name: "AutoCAD Drawing Exchange Format" }.freeze,
          { content_type: "text/csv", abbr: "CSV", name: "Comma-separated Values" }.freeze,
          { content_type: "text/plain", name: "Plain Text" }.freeze,
          { content_type: "text/xml", extension: ".xml", abbr: "XML", name: "XML Document" }.freeze,
          { content_type: "text/xml", extension: ".xsd", abbr: "XSD", name: "XML Schema" }.freeze,
        ].freeze

        OPENDOCUMENT_CONTENT_TYPES = %w(application/vnd.oasis.opendocument.presentation
                                        application/vnd.oasis.opendocument.spreadsheet
                                        application/vnd.oasis.opendocument.text).freeze

        def self.find(content_type, extension = nil)
          matching_types = TYPES.select { |type| type[:content_type] == content_type }

          return UnsupportedContentType.new(content_type: content_type) if matching_types.empty?

          extension_match = if matching_types.length > 1
                              matching_types.find { |type| type[:extension] == extension }
                            end

          content_type = extension_match || matching_types.first

          new(content_type)
        end

        def initialize(content_type)
          @content_type = content_type[:content_type]
          @name = content_type[:name]
          @abbr = content_type[:abbr]
        end

        def opendocument?
          OPENDOCUMENT_CONTENT_TYPES.include?(content_type)
        end
      end

      class UnsupportedContentType
        attr_reader :content_type

        def initialize(content_type:)
          @content_type = content_type
        end

        def name; end

        def abbr; end

        def opendocument?
          false
        end
      end
    end
  end
end
