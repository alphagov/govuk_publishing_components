require "rails_helper"

describe GovukPublishingComponents::ComponentDocs, type: :model do
  let(:component1) { { id: "component_1", name: "Component 1" } }
  let(:component2) { { id: "component_2", name: "Component 2" } }

  before do
    allow_any_instance_of(described_class).to receive(:fetch_component_docs).and_return([component1, component2])
  end

  describe "#used_in_this_app" do
    it "returns components in use" do
      docs = described_class.new(gem_components: true, limit_to: %w[component_1])
      used_components = docs.used_in_this_app
      expect(used_components.map(&:id)).to include("component_1")
      expect(used_components.map(&:id)).not_to include("component_2")
    end
  end

  describe "#not_used_in_this_app" do
    it "returns components not in use" do
      docs = described_class.new(gem_components: true, limit_to: %w[component_1])
      not_used_components = docs.not_used_in_this_app
      expect(not_used_components.map(&:id)).to include("component_2")
      expect(not_used_components.map(&:id)).not_to include("component_1")
    end
  end
end
