class FacetsIterator
  delegate :select, :any?, to: :@facets

  def initialize(facets)
    @facets = facets
    @facets_with_ga4_section = @facets.select(&:has_ga4_section?)
  end

  def each_with_index_and_count
    @facets.each do |facet|
      yield facet, @facets_with_ga4_section.index(facet), @facets_with_ga4_section.count
    end
  end
end
