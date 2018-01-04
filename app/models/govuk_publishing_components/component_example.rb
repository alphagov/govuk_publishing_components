require 'rouge'

module GovukPublishingComponents
  class ComponentExample
    attr_reader :id,
                :data,
                :context,
                :description,
                :block

    def initialize(id, data, context, description)
      @id = id
      @data = data || {}
      @context = context || {}
      @description = description || false
      @block = @data.delete(:block) || false
    end

    def name
      id.humanize
    end

    def highlight_code(string_to_format = '')
      formatter = Rouge::Formatters::HTML.new
      lexer = Rouge::Lexers::ERB.new
      formatter.format(lexer.lex(string_to_format)).html_safe
    end

    def pretty_data
      JSON.pretty_generate(data).gsub('\\n', "\n    ").gsub(/"(\w*)":/, '\1:').strip
    end

    def data?
      data.any?
    end

    def html_safe_data
      html_safe_strings(data.dup)
    end

    # Iterate through data object and recursively mark
    # any found string as html_safe
    #
    # Safe HTML can be passed to components, simulate
    # by marking any string that comes from YAML as safe
    def html_safe_strings(obj)
      if obj.is_a?(String)
        obj.html_safe
      elsif obj.is_a?(Hash)
        obj.each do |key, value|
          obj[key] = html_safe_strings(value)
        end
      elsif obj.is_a?(Array)
        obj.map! { |e| html_safe_strings(e) }
      else
        obj
      end
    end

    def right_to_left?
      !!context['right_to_left']
    end

    def dark_background?
      !!context['dark_background']
    end

    def html_description
      govspeak_to_html(description) if description.present?
    end

    def has_block?
      !!block
    end

  private

    def govspeak_to_html(govspeak)
      Govspeak::Document.new(govspeak).to_html
    end
  end
end
