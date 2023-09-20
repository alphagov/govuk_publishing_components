class Facet
  def initialize(facet)
    @facet = facet
  end

  def key
    facet["key"]
  end

  def keys
    facet["keys"]
  end

  def name
    facet["name"]
  end

  def type
    facet["type"]
  end

  def show_option_select_filter
    facet["show_option_select_filter"]
  end

  def short_name
    facet["short_name"]
  end

  def hide_facet_tag?
    facet["hide_facet_tag"] || false
  end

  def large?
    facet["large"] || false
  end

  def filterable?
    facet["filterable"] || false
  end

  def has_filters?
    false
  end

  def metadata?
    facet["display_as_result_metadata"] || false
  end

  def allowed_values
    facet["allowed_values"] || []
  end

  def query_params
    {}
  end

  def ga4_section
    nil
  end

  def has_ga4_section?
    !ga4_section.nil?
  end

private

  def and_word_connectors
    { words_connector: " and ", two_words_connector: " and " }
  end

  def or_word_connectors
    { words_connector: " or ", last_word_connector: " or " }
  end

  def value_fragments
    raise NotImplementedError
  end

  attr_reader :facet
end
