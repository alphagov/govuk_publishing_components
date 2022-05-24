module GovukPublishingComponents
  module Presenters
    class AttachmentHelper
      # Various departments are taking part in a pilot to use a form
      # rather than direct email for users to request accessible formats. When the pilot
      # scheme is rolled out further this can be removed.
      # Currently DfE, DWP and DVSA are participating in the pilot.
      EMAILS_IN_ACCESSIBLE_FORMAT_REQUEST_PILOT = %w[govuk_publishing_components@example.com
                                                     alternative.formats@education.gov.uk].freeze

      delegate :opendocument?, :document?, :spreadsheet?, to: :content_type

      attr_reader :attachment_data

      # Expects a hash of attachment data
      # * title and url are required
      # * content_type, filename, file_size, number of pages, alternative_format_contact_email can be provided
      # * attachment_id and owning_document_content_id are required to use the accessible format request form
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

      def content_type_name
        content_type.name
      end

      def file_size
        attachment_data[:file_size]
      end

      def number_of_pages
        attachment_data[:number_of_pages]
      end

      def alternative_format_contact_email
        attachment_data[:alternative_format_contact_email]
      end

      def attachment_id
        attachment_data[:attachment_id]
      end

      def owning_document_content_id
        attachment_data[:owning_document_content_id]
      end

      def reference
        reference = []
        reference << "ISBN #{attachment_data[:isbn]}" if attachment_data[:isbn].present?
        reference << attachment_data[:unique_reference] if attachment_data[:unique_reference].present?
        reference << attachment_data[:command_paper_number] if attachment_data[:command_paper_number].present?
        if attachment_data[:hoc_paper_number].present?
          hoc_reference = "HC #{attachment_data[:hoc_paper_number]}"
          hoc_reference += " #{attachment_data[:parliamentary_session]}" if attachment_data[:parliamentary_session].present?
          reference << hoc_reference
        end

        reference.join(", ")
      end

      def unnumbered_reference
        unnumbered_reference = "Unnumbered command paper" if attachment_data[:unnumbered_command_paper].eql?(true) && !attachment_data[:command_paper_number]
        unnumbered_reference = "Unnumbered act paper" if attachment_data[:unnumbered_hoc_paper].eql?(true) && !attachment_data[:hoc_paper_number]
        unnumbered_reference
      end

      def is_official_document
        attachment_data[:command_paper_number].present? || attachment_data[:hoc_paper_number].present? || attachment_data[:unnumbered_command_paper].eql?(true) || attachment_data[:unnumbered_hoc_paper].eql?(true)
      end

      def display_accessible_format_request_form_link?
        EMAILS_IN_ACCESSIBLE_FORMAT_REQUEST_PILOT.include?(alternative_format_contact_email) && owning_document_content_id.present? && attachment_id.present?
      end

      class SupportedContentType
        attr_reader :content_type_data

        TYPES = [
          { content_type: "application/msword", name: "MS Word Document", document: true }.freeze, # doc
          { content_type: "application/pdf", abbr: "PDF", name: "Portable Document Format", document: true }.freeze,
          { content_type: "application/postscript", extension: ".ps", abbr: "PS", name: "PostScript" }.freeze,
          { content_type: "application/postscript", extension: ".eps", abbr: "EPS", name: "Encapsulated PostScript" }.freeze,
          { content_type: "application/rtf", abbr: "RTF", name: "Rich Text Format" }.freeze,
          { content_type: "application/vnd.ms-excel", name: "MS Excel Spreadsheet", spreadsheet: true }.freeze,
          { content_type: "application/vnd.ms-excel.sheet.macroenabled.12", abbr: "XLSM", name: "MS Excel Macro-Enabled Workbook" }.freeze,
          { content_type: "application/vnd.ms-powerpoint", name: "MS Powerpoint Presentation" }.freeze, # ppt
          { content_type: "application/vnd.oasis.opendocument.presentation", abbr: "ODP", name: "OpenDocument Presentation", opendocument: true }.freeze,
          { content_type: "application/vnd.oasis.opendocument.spreadsheet", abbr: "ODS", name: "OpenDocument Spreadsheet", opendocument: true, spreadsheet: true }.freeze,
          { content_type: "application/vnd.oasis.opendocument.text", abbr: "ODT", name: "OpenDocument Text document", opendocument: true, document: true }.freeze,
          { content_type: "application/vnd.openxmlformats-officedocument.presentationml.presentation", name: "MS Powerpoint Presentation" }.freeze, # pptx
          { content_type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", name: "MS Excel Spreadsheet", spreadsheet: true }.freeze, # xlsx
          { content_type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document", name: "MS Word Document", document: true }.freeze, # docx
          { content_type: "application/xml", abbr: "XML", name: "XML Document" }.freeze,
          { content_type: "image/gif", abbr: "GIF", name: "Graphics Interchange Format" }.freeze,
          { content_type: "image/jpeg", name: "JPEG" }.freeze,
          { content_type: "image/png", abbr: "PNG", name: "Portable Network Graphic" }.freeze,
          { content_type: "image/vnd.dxf", abbr: "DXF", name: "AutoCAD Drawing Exchange Format" }.freeze,
          { content_type: "text/csv", abbr: "CSV", name: "Comma-separated Values", spreadsheet: true }.freeze,
          { content_type: "text/plain", name: "Plain Text" }.freeze,
          { content_type: "text/xml", extension: ".xml", abbr: "XML", name: "XML Document" }.freeze,
          { content_type: "text/xml", extension: ".xsd", abbr: "XSD", name: "XML Schema" }.freeze,
        ].freeze

        def self.find(content_type, extension = nil)
          matching_types = TYPES.select { |type| type[:content_type] == content_type }

          return UnsupportedContentType.new(content_type: content_type) if matching_types.empty?

          extension_match = if matching_types.length > 1
                              matching_types.find { |type| type[:extension] == extension }
                            end

          content_type = extension_match || matching_types.first

          new(content_type)
        end

        def initialize(content_type_data)
          @content_type_data = content_type_data
        end

        def content_type
          content_type_data[:content_type]
        end

        def abbr
          content_type_data[:abbr]
        end

        def name
          content_type_data[:name]
        end

        def opendocument?
          content_type_data[:opendocument].present?
        end

        def document?
          content_type_data[:document].present?
        end

        def spreadsheet?
          content_type_data[:spreadsheet].present?
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

        def document?
          false
        end

        def spreadsheet?
          false
        end
      end
    end
  end
end
