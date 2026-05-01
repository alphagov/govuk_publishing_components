module FlexiblePage::FlexibleSection
  class Base
    def initialize(_params); end

    def type
      self.class.name.split("::").last.underscore
    end
  end
end
