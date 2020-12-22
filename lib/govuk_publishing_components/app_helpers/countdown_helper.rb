module GovukPublishingComponents
  module AppHelpers
    class CountdownHelper
      END_OF_TRANSITION_PERIOD = Time.new(2020, 12, 31, 23, 59).in_time_zone("Europe/London")

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
        END_OF_TRANSITION_PERIOD - now_in_london
      end

      def now_in_london
        Time.now.in_time_zone("Europe/London")
      end
    end
  end
end
