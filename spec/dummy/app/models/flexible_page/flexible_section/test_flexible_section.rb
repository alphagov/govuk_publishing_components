module FlexiblePage::FlexibleSection
  class TestFlexibleSection < Base
    attr_reader :title

    def initialize(title:)
      super

      @title = title
    end
  end
end
