module GovukPublishingComponents
  class ComponentFixture
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
  end
end
