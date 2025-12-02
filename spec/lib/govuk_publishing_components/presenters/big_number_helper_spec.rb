require "spec_helper"

RSpec.describe GovukPublishingComponents::Presenters::BigNumberHelper do
  it "sets default value_classes correctly" do
    big = described_class.new({})
    expect(big.value_classes).to eq(["gem-c-big-number__value"])
  end

  it "sets default value_classes correctly when there is a href but no label" do
    big = described_class.new({ href: "/" })
    expect(big.value_classes).to eq(["gem-c-big-number__value", "gem-c-big-number__value--decorated"])
  end

  it "sets default value_classes correctly when there is a href and a label" do
    big = described_class.new({ href: "/", label: "my_label" })
    expect(big.value_classes).to eq(["gem-c-big-number__value"])
  end

  it "detects when a number is a string with a plus suffix" do
    big = described_class.new({ number: "200+" })
    expect(big.number_has_plus_suffix?).to be(true)
  end

  it "detects when a number is a string without a plus suffix" do
    big = described_class.new({ number: "200" })
    expect(big.number_has_plus_suffix?).to be(false)
  end

  it "detects when a number is a string without a plus suffix but there's a plus elsewhere in it" do
    big = described_class.new({ number: "+200" })
    expect(big.number_has_plus_suffix?).to be(false)
  end
end
