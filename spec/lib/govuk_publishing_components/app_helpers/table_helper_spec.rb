require "rails_helper"

RSpec.describe GovukPublishingComponents::AppHelpers::TableHelper do
  describe ".helper" do
    let(:view_context) { GovukPublishingComponents::ApplicationController.new.view_context }

    it "returns HTML for a table" do
      table = described_class.helper(view_context) { |_builder| }

      expect(table).to eq('<table class="gem-c-table govuk-table"><caption class="govuk-table__caption"></caption></table>')
    end

    it "yields a TableBuilder object" do
      expect { |b| described_class.helper(view_context, &b) }
        .to yield_with_args(an_instance_of(described_class::TableBuilder))
    end

    it "can accept a caption for the table" do
      table = described_class.helper(view_context, "my caption") { |_builder| }

      expect(table).to match('<caption class="govuk-table__caption">my caption</caption>')
    end

    it "can be configured to be sortable" do
      table = described_class.helper(view_context, nil, sortable: true) { |_builder| }

      expect(table).to match('<table class="gem-c-table govuk-table govuk-table--sortable">')
    end

    it "can be configured to set classes on the caption" do
      table = described_class.helper(view_context, nil, caption_classes: %w[class-a class-b]) { |_builder| }

      expect(table).to match('<caption class="govuk-table__caption class-a class-b">')
    end

    it "can be configured to set an id on the table" do
      table = described_class.helper(view_context, nil, table_id: "table-id") { |_builder| }

      expect(table).to match(/<table(?:.*)id="table-id">/)
    end

    it "can be configured to set margin_bottom on the table" do
      # valid margin is added
      (0..9).each do |margin|
        table = described_class.helper(view_context, nil, margin_bottom: margin) { |_builder| }
        expect(table).to match("<table class=\"gem-c-table govuk-table govuk-!-margin-bottom-#{margin}\">")
      end

      # invalid margin is ignored
      invalid_margin = [-1, 10, "hello", nil, true]
      invalid_margin.each do |margin|
        table = described_class.helper(view_context, nil, margin_bottom: margin) { |_builder| }
        expect(table).to match("<table class=\"gem-c-table govuk-table\">")
      end
    end
  end
end
