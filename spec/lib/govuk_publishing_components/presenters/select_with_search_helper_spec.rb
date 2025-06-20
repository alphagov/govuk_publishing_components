require "spec_helper"
require "action_view"

RSpec.describe GovukPublishingComponents::Presenters::SelectWithSearchHelper do
  describe "Select with search helper" do
    it "generates options for select" do
      instance = described_class.new(
        options: [
          {
            text: "Foo",
            value: "Bar",
          },
          {
            text: "Option",
            value: "opt",
            selected: true,
          },
          {
            text: "Baz",
            value: "Bam",
          },
        ],
      )

      result = <<~HTML.strip
        <option value="Bar">Foo</option>
        <option selected="selected" value="opt">Option</option>
        <option value="Bam">Baz</option>
      HTML

      expect(instance.options_markup).to eq result
    end

    it "generates grouped options for select" do
      instance = described_class.new(
        grouped_options: [
          [
            "",
            [
              {
                text: "All organisations",
                value: "",
                selected: true,
              },
            ],
          ],
          [
            "",
            [
              {
                text: "All foo",
                value: "foo",
              },
            ],
          ],
          [
            "Live organisations",
            %w[foo bar baz].map do |key|
              {
                text: key,
                value: key,
              }
            end,
          ],
        ],
      )

      result = <<~HTML.strip
        <option selected="selected" value="">All organisations</option>
        <option value="foo">All foo</option>
        <optgroup label="Live organisations">
        <option value="foo">foo</option>
        <option value="bar">bar</option>
        <option value="baz">baz</option>
        </optgroup>
      HTML

      expect(instance.options_markup.delete("\n")).to eq result.delete("\n")
    end

    it "includes a blank option when told to" do
      instance = described_class.new(
        include_blank: true,
        options: [
          {
            text: "Foo",
            value: "Bar",
          },
        ],
      )

      result = <<~HTML.strip
        <option value=""></option><option value="Bar">Foo</option>
      HTML

      expect(instance.options_markup).to eq result
    end
  end
end
