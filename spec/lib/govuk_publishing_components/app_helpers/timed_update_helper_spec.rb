require "spec_helper"
require "timecop"

RSpec.describe GovukPublishingComponents::AppHelpers::TimedUpdateHelper do
  describe "Timed Update helper" do
    it "#before_update_time? returns true if we haven't reached the requested time yet" do
      Time.zone = "London"
      Timecop.freeze(2024, 6, 17, 23, 59)
      expect(GovukPublishingComponents::AppHelpers::TimedUpdateHelper.before_update_time?(year: 2024, month: 6, day: 18, hour: 0, minute: 0)).to be true
    end

    it "#before_update_time? returns false if we've reached the requested time" do
      Time.zone = "London"
      Timecop.freeze(2024, 6, 18, 0, 0)
      expect(GovukPublishingComponents::AppHelpers::TimedUpdateHelper.before_update_time?(year: 2024, month: 6, day: 18, hour: 0, minute: 0)).to be false
    end

    it "#before_update_time? returns false if we've passed the requested time" do
      Time.zone = "London"
      Timecop.freeze(2024, 6, 20, 10, 10)
      expect(GovukPublishingComponents::AppHelpers::TimedUpdateHelper.before_update_time?(year: 2024, month: 6, day: 18, hour: 0, minute: 0)).to be false
    end
  end
end
