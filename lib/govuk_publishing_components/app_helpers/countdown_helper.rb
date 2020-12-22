module GovukPublishingComponents
  module AppHelpers
    class CountdownHelper
      DEADLINE = Time.new(2020, 12, 31, 23, 59)

      def days_left
        sprintf "%02d", days_left_until_deadline
      end

      def show?
        minutes_left_until_deadline >= 30
      end

      def days_text
        if days_left_until_deadline == 1
          I18n.t!("components.transition_countdown.day_to_go")
        else
          I18n.t!("components.transition_countdown.days_to_go")
        end
      end

    private

      def days_left_until_deadline
        (minutes_left_until_deadline / 60 / 24).ceil
      end

      def minutes_left_until_deadline
        (seconds_left_until_deadline / 60)
      end

      def seconds_left_until_deadline
        end_of_transition_period - now_in_london
      end

      def end_of_transition_period
        london_time_zone(DEADLINE)
      end

      def now_in_london
        london_time_zone(Time.now)
      end

      def london_time_zone(time)
        time.in_time_zone("Europe/London")
      end
    end
  end
end
