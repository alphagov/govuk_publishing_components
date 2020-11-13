module GovukPublishingComponents
  module AppHelpers
    class CountdownHelper
      END_OF_TRANSITION_PERIOD = Date.new(2021, 1, 1)

      def days_left
        sprintf "%02d", days_left_integer
      end

      def show?
        days_left_integer.positive?
      end

      def days_text
        if days_left_integer == 1
          I18n.t!("components.transition_countdown.day_to_go")
        else
          I18n.t!("components.transition_countdown.days_to_go")
        end
      end

    private

      def days_left_integer
        (END_OF_TRANSITION_PERIOD - today_in_london).to_i
      end

      def today_in_london
        Time.find_zone("Europe/London").today
      end
    end
  end
end
