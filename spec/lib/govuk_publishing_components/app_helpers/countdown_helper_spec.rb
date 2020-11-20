require "spec_helper"

RSpec.describe GovukPublishingComponents::AppHelpers::CountdownHelper do
  describe "Countdown helper" do
    it "gives the days left until end of transition period" do
      clock = described_class.new
      day_before_transition_period_ends = Date.new(2020, 12, 31)
      travel_to day_before_transition_period_ends
      expect(clock.days_left).to eql("01")
    end

    it "returns true until 23.59 on December 31st 2020" do
      clock = described_class.new
      minute_to_midnight_on_brexit_eve = Time.zone.local(2020, 12, 31, 23, 59)
      travel_to minute_to_midnight_on_brexit_eve
      expect(clock.show?).to eql(true)
    end

    it "returns false from midnight on the eve of January 1st 2021" do
      clock = described_class.new
      midnight_on_brexit_eve = Time.zone.local(2020, 12, 31, 24, 0)
      travel_to midnight_on_brexit_eve
      expect(clock.show?).to eql(false)
    end

    it "pluralizes day if necessary" do
      clock = described_class.new
      one_day_left = Date.new(2020, 12, 31)
      travel_to one_day_left
      expect(clock.days_text).to eql("day to go")

      two_days_left = Date.new(2020, 12, 30)
      travel_to two_days_left
      expect(clock.days_text).to eql("days to go")
    end
  end
end
