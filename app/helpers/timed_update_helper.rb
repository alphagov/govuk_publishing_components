module TimedUpdateHelper
  def before_update_time?(year:, month:, day:, hour:, minute:)
    Time.zone.now.before? Time.zone.local(year, month, day, hour, minute)
  end
end
