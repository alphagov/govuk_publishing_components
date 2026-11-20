module GovukPublishingComponents
  module Presenters
    class DatetimeFieldsHelper
      def initialise; end

      def error_id_times(error_items, error_id, error_id_time, error_items_time)
        if error_items
          error_id
        elsif error_items_time
          error_id_time
        end
      end

      def date_input_items(day, month, year)
        [
          {
            label: "Day",
            name: day ? day[:name] : "day",
            width: 2,
            id: day ? day[:id] : nil,
            value: day ? day[:value] : nil,
          },
          {
            label: "Month",
            name: month ? month[:name] : "month",
            width: 2,
            id: month ? month[:id] : nil,
            value: month ? month[:value] : nil,
          },
          {
            label: "Year",
            name: year ? year[:name] : "year",
            width: 4,
            id: year ? year[:id] : nil,
            value: year ? year[:value] : nil,
          },
        ]
      end

      def hour_options(hour)
        hour_value = hour && hour[:value].present? ? hour[:value] : ""
        hours = (0..23).to_a
        hour_options = [{ text: "", value: "" }]

        hours.each do |hour|
          hour_options << { text: hour.to_s.rjust(2, "0"), value: hour.to_s.rjust(2, "0"), selected: hour == hour_value }
        end

        hour_options
      end

      def minute_options(minute)
        minute_value = minute && minute[:value].present? ? minute[:value] : ""
        minutes = (0..59).to_a
        minute_options = [{ text: "", value: "" }]

        minutes.each do |minute|
          minute_options << { text: minute.to_s.rjust(2, "0"), value: minute.to_s.rjust(2, "0"), selected: minute == minute_value }
        end

        minute_options
      end
    end
  end
end
