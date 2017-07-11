module GovukPublishingComponents
  ComponentFixture = Struct.new(:id, :data) do
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
