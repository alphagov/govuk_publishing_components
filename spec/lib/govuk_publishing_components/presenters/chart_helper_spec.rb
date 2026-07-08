RSpec.describe GovukPublishingComponents::Presenters::ChartHelper do
  describe "Chart component helper" do
    required_params = {}
    expected = {}

    before do
      required_params = {
        h_axis_title: "Day",
        v_axis_title: "Views",
      }

      expected = {
        chartArea: { width: "auto", height: "auto" },
        crosshair: { orientation: "vertical", trigger: "both", color: "#ccc" },
        curveType: "none",
        enableInteractivity: true,
        legend: {
          position: "top",
          textStyle: { color: "#000", fontName: "GDS Transport", fontSize: "16", italic: false },
        },
        pointSize: 8,
        height: 400,
        tooltip: { isHtml: true },
        series: {},
        hAxis: {
          textStyle: { color: "#000", fontName: "GDS Transport", fontSize: "16", italic: false },
          title: "Day",
          titleTextStyle: { color: "#000", fontName: "GDS Transport", fontSize: "19", italic: false },
          format: nil,
        },
        vAxis: {
          textStyle: { color: "#000", fontName: "GDS Transport", fontSize: "16", italic: false },
          title: "Views",
          titleTextStyle: { color: "#000", fontName: "GDS Transport", fontSize: "19", italic: false },
          format: nil,
          viewWindow: {
            min: 0,
          },
        },
      }
    end

    it "returns default chart options" do
      chart_helper = described_class.new(required_params)
      options = chart_helper.chart_options
      expect(options).to eql(expected)
    end

    it "returns expected options when hide_legend is true" do
      required_params[:hide_legend] = true
      expected[:legend] = "none"

      chart_helper = described_class.new(required_params)
      options = chart_helper.chart_options
      expect(options).to eql(expected)
    end

    it "does not hide the legend when hide_legend is true but there are multiple rows of data" do
      required_params[:hide_legend] = true
      required_params[:rows] = [
        {
          label: "January",
          values: [1, 2, 3],
        },
        {
          label: "February",
          values: [3, 4, 5],
        },
      ]

      chart_helper = described_class.new(required_params)
      options = chart_helper.chart_options
      expect(options).to eql(expected)
    end

    it "returns expected options when height is changed" do
      required_params[:height] = 300
      expected[:height] = 300

      chart_helper = described_class.new(required_params)
      options = chart_helper.chart_options
      expect(options).to eql(expected)
    end

    it "sets the y axis scale correctly" do
      required_params[:y_axis_auto_adjust] = true
      expected[:vAxis][:viewWindow][:min] = "auto"

      chart_helper = described_class.new(required_params)
      options = chart_helper.chart_options
      expect(options).to eql(expected)
    end

    it "formats passed data correctly" do
      required_params[:rows] = [
        {
          label: "January",
          values: [1, 2, 3],
        },
        {
          label: "February",
          values: [3, 4, 5],
        },
      ]
      required_params[:keys] = %w[1st 2nd 3rd]
      expected = [
        {
          data: [
            ["1st", 1],
            ["2nd", 2],
            ["3rd", 3],
          ],
          name: "January",
        },
        {
          data: [
            ["1st", 3],
            ["2nd", 4],
            ["3rd", 5],
          ],
          name: "February",
        },
      ]

      chart_helper = described_class.new(required_params)
      data = chart_helper.chart_format_data
      expect(data).to eql(expected)
    end

    it "returns expected options when line colours and styles are changed" do
      required_params[:line_colours] = %w[red blue]
      required_params[:line_styles] = %w[normal dotted normal]
      expected[:series] = {
        0 => { color: "red", lineDashStyle: nil },
        1 => { color: "blue", lineDashStyle: [2, 2] },
        2 => { lineDashStyle: nil },
      }

      chart_helper = described_class.new(required_params)
      options = chart_helper.chart_options
      expect(options).to eql(expected)
    end

    it "returns expected options when axis label format is changed to date" do
      required_params[:h_axis_format] = "date"
      required_params[:v_axis_format] = "date"
      expected[:hAxis][:format] = "YYYY-MM-dd"
      expected[:vAxis][:format] = "YYYY-MM-dd"

      chart_helper = described_class.new(required_params)
      options = chart_helper.chart_options
      expect(options).to eql(expected)
    end

    it "returns expected options when axis label format is changed to currency" do
      required_params[:h_axis_format] = "currency"
      required_params[:v_axis_format] = "currency"
      expected[:hAxis][:format] = "£#"
      expected[:vAxis][:format] = "£#"

      chart_helper = described_class.new(required_params)
      options = chart_helper.chart_options
      expect(options).to eql(expected)
    end

    it "returns expected options when axis label format is changed to percent" do
      required_params[:h_axis_format] = "percent"
      required_params[:v_axis_format] = "percent"
      expected[:hAxis][:format] = "#'\%'"
      expected[:vAxis][:format] = "#'\%'"

      chart_helper = described_class.new(required_params)
      options = chart_helper.chart_options
      expect(options).to eql(expected)
    end
  end
end
