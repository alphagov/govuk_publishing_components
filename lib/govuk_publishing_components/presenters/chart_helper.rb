module GovukPublishingComponents
  module Presenters
    class ChartHelper
      def initialize(options)
        @rows = options[:rows]
        @keys = options[:keys]
        @minimal = options[:minimal]
        @enable_interactivity = true unless @minimal
        @hide_legend = options[:hide_legend]
        @point_size = options[:point_size] ||= 10
        @height = options[:height] || 400
        @h_axis_title = options[:h_axis_title]
        @v_axis_title = options[:v_axis_title]
        @text_position = "none" if @minimal
        @y_axis_view_window_min = 0
        @y_axis_view_window_min = "auto" if options[:y_axis_auto_adjust]
        @line_colours = options[:line_colours]
        @line_styles = options[:line_styles]
        @h_axis_format = "YYYY-MM-dd" if options[:h_axis_format] == "date"
        @v_axis_format = "YYYY-MM-dd" if options[:v_axis_format] == "date"
      end

      # config options are here: https://developers.google.com/chart/interactive/docs/gallery/linechart
      def chart_options
        {
          chartArea: { width: "80%", height: "60%" },
          crosshair: { orientation: "vertical", trigger: "both", color: "#ccc" },
          curveType: "none",
          enableInteractivity: @enable_interactivity,
          legend: legend_options,
          pointSize: @point_size,
          height: @height,
          tooltip: { isHtml: true },
          series: series_options,
          hAxis: {
            textStyle: set_font_16,
            title: @h_axis_title,
            titleTextStyle: set_font_19,
            textPosition: @text_position,
            format: @h_axis_format,
          },
          vAxis: {
            textStyle: set_font_16,
            title: @v_axis_title,
            titleTextStyle: set_font_19,
            textPosition: @text_position,
            format: @v_axis_format,
            viewWindow: {
              min: @y_axis_view_window_min,
            },
          },
        }
      end

      def chart_format_data
        if !@rows.empty? && !@keys.empty?
          @rows.map do |row|
            {
              name: row[:label],
              data: @keys.zip(row[:values]),
            }
          end
        end
      end

    private

      def legend_options
        return { position: "top", textStyle: set_font_16 } unless @hide_legend

        "none"
      end

      def set_font_16
        { color: "#000", fontName: "GDS Transport", fontSize: "16", italic: false }
      end

      def set_font_19
        { color: "#000", fontName: "GDS Transport", fontSize: "19", italic: false }
      end

      def series_options
        series = {}
        if @line_colours
          @line_colours.each_with_index do |item, index|
            series[index] = {} unless series[index]
            series[index][:color] = item
          end
        end

        if @line_styles
          @line_styles.each_with_index do |item, index|
            style = [2, 2] if item == "dotted"
            series[index] = {} unless series[index]
            series[index][:lineDashStyle] = style
          end
        end

        series
      end
    end
  end
end
