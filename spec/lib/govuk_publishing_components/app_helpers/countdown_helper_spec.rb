require "spec_helper"

RSpec.describe GovukPublishingComponents::AppHelpers::CountdownHelper do
  describe "Countdown helper" do
    it "gives the days left until end of transition period" do
      clock = described_class.new
      nine_am_on_brexit_eve = Time.zone.local(2020, 12, 31, 9, 0)
      travel_to nine_am_on_brexit_eve
      expect(clock.days_left).to eql("01")
    end

    it "returns true until 23.29 on December 31st 2020" do
      clock = described_class.new
      one_minute_before_component_shut_off_time = Time.zone.local(2020, 12, 31, 23, 29)
      travel_to one_minute_before_component_shut_off_time
      expect(clock.show?).to eql(true)
    end

    it "returns false from 23.31 on December 31st 2020" do
      clock = described_class.new
      one_minute_after_component_shut_off_time = Time.zone.local(2020, 12, 31, 23, 30)
      travel_to one_minute_after_component_shut_off_time
      expect(clock.show?).to eql(false)
    end

    it "pluralizes day if necessary" do
      clock = described_class.new
      one_day_left = Time.zone.local(2020, 12, 31, 9, 0)
      travel_to one_day_left
      expect(clock.days_text).to eql("day to go")

      two_days_left = Time.zone.local(2020, 12, 30, 9, 0)
      travel_to two_days_left
      expect(clock.days_text).to eql("days to go")
    end
  end
end
