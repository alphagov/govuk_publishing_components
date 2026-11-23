RSpec.describe GovukPublishingComponents::Presenters::DatetimeFieldsHelper do
  describe "Datetime Fields helper" do
    describe "#error_id" do
      it "returns the correct value when a value for 'error_items' is passed" do
        allow(SecureRandom).to receive(:hex).and_return("1234")

        datetime_fields_helper = described_class.new(
          error_items: {
            text: "Descriptive error 1",
          },
          error_items_time: nil,
        )

        expect(datetime_fields_helper.error_id).to eql("error-1234")
      end

      it "returns the correct value when a value for 'error_items_time' is passed" do
        allow(SecureRandom).to receive(:hex).and_return("1234")

        datetime_fields_helper = described_class.new(
          error_items: nil,
          error_items_time: {
            text: "Descriptive time error 1",
          },
        )

        expect(datetime_fields_helper.error_id).to eql("error-time-1234")
      end
    end

    describe "#date_input_items" do
      it "returns the correct default values" do
        datetime_fields_helper = described_class.new(
          error_items: nil,
          error_items_time: nil,
        )

        expected = [
          {
            label: "Day",
            name: "day",
            width: 2,
            id: nil,
            value: nil,
          },
          {
            label: "Month",
            name: "month",
            width: 2,
            id: nil,
            value: nil,
          },
          {
            label: "Year",
            name: "year",
            width: 4,
            id: nil,
            value: nil,
          },
        ]

        expect(datetime_fields_helper.date_input_items(nil, nil, nil)).to eql(expected)
      end

      it "returns the correct values for given year/month/day parameters" do
        datetime_fields_helper = described_class.new(
          error_items: nil,
          error_items_time: nil,
        )

        year = { name: "year_field_name", id: "year_id", value: 2022 }
        month = { name: "month_field_name", id: "month_id", value: 1 }
        day = { name: "day_field_name", id: "day_id", value: 2 }

        expected = [
          {
            label: "Day",
            name: "day_field_name",
            width: 2,
            id: "day_id",
            value: 2,
          },
          {
            label: "Month",
            name: "month_field_name",
            width: 2,
            id: "month_id",
            value: 1,
          },
          {
            label: "Year",
            name: "year_field_name",
            width: 4,
            id: "year_id",
            value: 2022,
          },
        ]

        expect(datetime_fields_helper.date_input_items(day, month, year)).to eql(expected)
      end
    end

    describe "#hour_options" do
      it "returns the correct values when no value given for 'hour'" do
        expected = [{ text: "", value: "" }]
        items = (0..23).to_a

        datetime_fields_helper = described_class.new(
          error_items: nil,
          error_items_time: nil,
        )

        hour = nil
        items.each do |item|
          expected << {
            text: item.to_s.rjust(2, "0"),
            value: item.to_s.rjust(2, "0"),
            selected: false,
          }
        end

        expect(datetime_fields_helper.hour_options(hour)).to eql(expected)
      end

      it "returns the correct values when a value is given for 'hour'" do
        expected = [{ text: "", value: "" }]
        items = (0..23).to_a

        datetime_fields_helper = described_class.new(
          error_items: nil,
          error_items_time: nil,
        )

        hour = { value: 9 }
        items.each do |item|
          expected << {
            text: item.to_s.rjust(2, "0"),
            value: item.to_s.rjust(2, "0"),
            selected: item == hour[:value],
          }
        end

        expect(datetime_fields_helper.hour_options(hour)).to eql(expected)
      end
    end

    describe "#minute_options" do
      it "returns the correct values when no value given for 'minute'" do
        expected = [{ text: "", value: "" }]
        items = (0..59).to_a

        datetime_fields_helper = described_class.new(
          error_items: nil,
          error_items_time: nil,
        )

        minute = nil
        items.each do |item|
          expected << {
            text: item.to_s.rjust(2, "0"),
            value: item.to_s.rjust(2, "0"),
            selected: false,
          }
        end

        expect(datetime_fields_helper.minute_options(minute)).to eql(expected)
      end

      it "returns the correct values when a value is given for 'minute'" do
        expected = [{ text: "", value: "" }]
        items = (0..59).to_a

        datetime_fields_helper = described_class.new(
          error_items: nil,
          error_items_time: nil,
        )

        minute = { value: 30 }
        items.each do |item|
          expected << {
            text: item.to_s.rjust(2, "0"),
            value: item.to_s.rjust(2, "0"),
            selected: item == minute[:value],
          }
        end

        expect(datetime_fields_helper.minute_options(minute)).to eql(expected)
      end
    end
  end
end
