module GovukPublishingComponents
  module Presenters
    class ChartHelper
      # attr_reader :options, :margin_top, :margin_bottom, :heading_level, :classes

      def initialize(local_assigns)
        @rows = local_assigns[:rows]
        @keys = local_assigns[:keys]
        @minimal = local_assigns[:minimal]
        @enableInteractivity = true
        @enableInteractivity = false if @minimal
        @hide_legend = local_assigns[:hide_legend]
        @point_size = local_assigns[:point_size]
        @point_size = 0 if @minimal
        @y_axis_auto_adjust = local_assigns[:y_axis_auto_adjust]
        @height = local_assigns[:height]
        @h_axis_title = local_assigns[:h_axis_title]
        @v_axis_title = local_assigns[:v_axis_title]
        @line_width = local_assigns[:line_width]
      end

      # https://developers.google.com/chart/interactive/docs/gallery/linechart
      def chart_options
        {
          chartArea: { width: '80%', height: '60%' },
          crosshair: { orientation: 'vertical', trigger: 'both', color: '#ccc' },
          curveType: 'none',
          enableInteractivity: @enableInteractivity,
          legend: legend_options,
          pointSize: @point_size,
          height: @height,
          tooltip: { isHtml: true },
          lineWidth: @line_width,
          series: series_options,
          hAxis: {
            textStyle: set_font_16,
            title: @h_axis_title,
            titleTextStyle: set_font_19,
            textPosition: text_position,
            maxAlternation: 1,
          },
          vAxis: {
            textStyle: set_font_16,
            title: @v_axis_title,
            titleTextStyle: set_font_19,
            textPosition: text_position,
            viewWindow: {
              min: set_y_axis_start
            }
          },
        }
      end

      def chart_format_data
        if @rows.length > 0 && @keys.length > 0
          @rows.map do |row|
            {
              name: row[:label],
              linewidth: 10,
              data: @keys.zip(row[:values])
            }
          end
        end
      end

    private

      def legend_options
        return { position: 'top', textStyle: set_font_16 } unless @hide_legend

        'none'
      end

      def set_font_16
        { color: '#000', fontName: 'GDS Transport', fontSize: '16', italic: false }
      end

      def set_font_19
        { color: '#000', fontName: 'GDS Transport', fontSize: '19', italic: false }
      end

      def text_position
        return 'none' if @minimal
      end

      def set_y_axis_start
        return "auto" if @y_axis_auto_adjust

        0
      end

      def series_options
        series = {}
        if line_colours
          line_colours.each_with_index do |item,index|
            series[index] = {} unless series[index]
            series[index][:color] = item
          end
        end

        if line_styles
          line_styles.each_with_index do |item,index|
            style = [2, 2] if item == "dotted"
            series[index] = {} unless series[index]
            series[index][:lineDashStyle] = style
          end
        end
      end
    end
  end
end
