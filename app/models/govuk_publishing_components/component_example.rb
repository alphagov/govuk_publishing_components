module GovukPublishingComponents
  class ComponentExample
    attr_reader :id,
                :data

    def initialize(id, data)
      @id = id
      @data = data
    end

    def name
      id.humanize
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
  end
end
