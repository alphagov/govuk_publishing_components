module GovukNavigationHelpers
  # Take a content item and group the related links according to an algorithm
  # that is intended to display the related links into three groups, depending
  # on how much they have in common with the main content item.
  #
  # @private
  class GroupedRelatedLinks
    attr_reader :content_item

    def initialize(content_item)
      @content_item = content_item
    end

    # This will return related items that are tagged to the same mainstream
    # browse page as the main content item.
    def tagged_to_same_mainstream_browse_page
      return [] unless content_item.parent

      @tagged_to_same_mainstream_browse_page ||= content_item.related_links.select do |related_item|
        related_item.mainstream_browse_pages.map(&:content_id).include?(content_item.parent.content_id)
      end
    end

    # This will return related items whose parents are tagged to the same mainstream
    # browse page as the main content item's parent.
    def parents_tagged_to_same_mainstream_browse_page
      return [] unless content_item.parent && content_item.parent.parent

      common_parent_content_ids = tagged_to_same_mainstream_browse_page.map(&:content_id)

      @parents_tagged_to_same_mainstream_browse_page ||= content_item.related_links.select do |related_item|
        next if common_parent_content_ids.include?(related_item.content_id)
        related_item.mainstream_browse_pages.map(&:parent).map(&:content_id).include?(content_item.parent.parent.content_id)
      end
    end

    # This will return related links that are tagged to mainstream browse
    # pages unrelated to the main content item.
    def tagged_to_different_mainstream_browse_pages
      all_content_ids = (tagged_to_same_mainstream_browse_page + parents_tagged_to_same_mainstream_browse_page).map(&:content_id)

      @tagged_to_different_mainstream_browse_pages ||= content_item.related_links.reject do |related_item|
        all_content_ids.include?(related_item.content_id)
      end
    end
  end
end
