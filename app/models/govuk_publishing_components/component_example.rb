require "rouge"

module GovukPublishingComponents
  class ComponentExample
    attr_reader :id,
                :data,
                :context,
                :description,
                :block,
                :block_arguments,
                :embed

    def initialize(id, example)
      @id = id
      @data = example["data"] || {}
      @context = example["context"] || {}
      @description = example["description"] || false
      @block = @data.delete(:block) || false
      @block_arguments = @data.delete(:block_arguments) || []
      @embed = example["embed"]
    end

    def name
      id.humanize
    end

    def highlight_code(string_to_format = "")
      formatter = Rouge::Formatters::HTML.new
      lexer = Rouge::Lexers::ERB.new
      formatter.format(lexer.lex(string_to_format)).html_safe
    end

    def pretty_data
      json_key_regex = /"(\w*)":/ # matches quoted keys ending with a colon, i.e. "key":
      output = JSON.pretty_generate(data).gsub('\\n', "\n    ").gsub(json_key_regex, '\1:')

      quoted_string_regex = /"((?:[^"\\]|\\.)*)"/ # matches "some text" - ignores escaped quotes, i.e. \"
      output.gsub(quoted_string_regex) do |group|
        match = Regexp.last_match[1]
        contains_html?(match) ? "sanitize(#{group})" : group
      end
    end

    def contains_html?(input)
      ActionController::Base.helpers.strip_tags(input) != input
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
      case obj
      when String
        obj.html_safe
      when Hash
        obj.each do |key, value|
          obj[key] = html_safe_strings(value)
        end
      when Array
        obj.map! { |e| html_safe_strings(e) }
      else
        obj
      end
    end

    def right_to_left?
      context["right_to_left"].present?
    end

    def dark_background?
      context["dark_background"].present?
    end

    def black_background?
      !!context["black_background"]
    end

    def html_description
      markdown_to_html(description) if description.present?
    end

    def has_block?
      block.present?
    end

    def has_embed?
      embed.present?
    end

  private

    def markdown_to_html(markdown)
      Kramdown::Document.new(markdown).to_html
    end
  end
end
