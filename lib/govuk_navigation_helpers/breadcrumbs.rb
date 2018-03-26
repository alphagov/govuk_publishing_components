module GovukNavigationHelpers
  class Breadcrumbs
    def initialize(content_item)
      @content_item = ContentItem.new(content_item)
    end

    def breadcrumbs
      ordered_parents = all_parents.map do |parent|
        { title: parent.title, url: parent.base_path }
      end

      ordered_parents << { title: "Home", url: "/" }

      {
        breadcrumbs: ordered_parents.reverse
      }
    end

  private

    attr_reader :content_item

    def all_parents
      parents = []

      direct_parent = content_item.parent
      while direct_parent
        parents << direct_parent

        direct_parent = direct_parent.parent
      end

      parents
    end
  end
end
