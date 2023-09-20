class FindersController < ApplicationController
  layout "finder_layout"
  include AbTests::ElasticSearchAaTestable

  before_action do
    set_expiry(content_item)
  end

  def show
    slimmer_template "gem_layout_full_width" if i_am_a_topic_page_finder

    if page_under_test?
      set_requested_variant
    end

    respond_to do |format|
      format.html do
        raise UnsupportedContentItem unless content_item.is_finder?

        if legacy_params_present?
          transform_legacy_announcement_params_and_redirect if content_item.base_path == "/search/news-and-communications"
          transform_legacy_publication_params_and_redirect if content_item.base_path == "/search/all"
        end

        show_page_variables
      end
      format.json do
        @search_query = initialize_search_query
        if content_item.is_search? || content_item.is_finder?
          @spelling_suggestion_presenter = spelling_suggestion_presenter
          render json: json_response
        else
          render json: {}, status: :not_found
        end
      end
      format.atom do
        if content_item.is_redirect?
          redirect_to_destination
        else
          @search_query = initialize_search_query(is_for_feed: true)
          @feed = AtomPresenter.new(content_item, results, facet_tags)
        end
      end
    end
  rescue ActionController::UnknownFormat
    render plain: "Not acceptable", status: :not_acceptable
  rescue UnsupportedContentItem
    render plain: "Not found", status: :not_found
  end

  def show_page_variables
    @search_query = initialize_search_query
    @breadcrumbs = fetch_breadcrumbs
    @parent = parent
    @sort_presenter = sort_presenter
    @pagination = pagination_presenter
    @spelling_suggestion_presenter = spelling_suggestion_presenter
  end

private

  class UnsupportedContentItem < StandardError; end

  attr_reader :search_query

  helper_method :facet_tags, :i_am_a_topic_page_finder, :result_set_presenter, :content_item, :signup_links, :filter_params, :facets, :page_under_test?

  def redirect_to_destination
    @redirect = content_item.redirect
    @finder_slug = finder_slug
    render "finders/show_redirect"
  end

  def json_response
    {
      total: result_set_presenter.total_count,
      display_total: result_set_presenter.displayed_total,
      facet_tags: render_component("finders/facet_tags", facet_tags.present),
      search_results: render_component("finders/search_results", result_set_presenter.search_results_content),
      display_selected_facets_count: facet_tags.display_total_selected_filters,
      sort_options_markup: render_component("finders/sort_options", sort_presenter.to_hash),
      next_and_prev_links: render_component("govuk_publishing_components/components/previous_and_next_navigation", pagination_presenter.next_and_prev_links),
      suggestions: render_component("finders/spelling_suggestion", suggestions: spelling_suggestion_presenter.suggestions),
      errors: search_query.errors_hash,
    }
  end

  def render_component(partial, locals)
    (render_to_string(formats: %i[html], partial:, locals:) || "").squish
  end

  def result_set_presenter
    @result_set_presenter ||= ResultSetPresenter.new(
      content_item,
      all_facets,
      results,
      filter_params,
      sort_presenter,
      content_item.metadata_class,
      debug_score: debug_score?,
      include_ecommerce: include_ecommerce?,
    )
  end

  def results
    @results ||= ResultSetParser.parse(search_results)
  end

  def all_facets
    return @facets if defined?(@facets)

    FacetsBuilder.new(content_item:, search_results:, value_hash: filter_params).facets
  end

  def facets
    FacetsIterator.new(all_facets.select(&:filterable?))
  end

  def signup_links
    @signup_links ||= SignupLinksPresenter.new(content_item, all_facets, keywords).signup_links
  end

  def initialize_search_query(is_for_feed: false)
    Search::Query.new(
      content_item,
      filter_params,
      override_sort_for_feed: is_for_feed,
      ab_params: {},
    )
  end

  def content_item_with_search_results
    @content_item_with_search_results ||= search_query.content_item_with_search_results
  end

  def fetch_breadcrumbs
    parent_slug = params["parent"]
    org_info = organisation_registry[parent_slug] if parent_slug.present?
    FinderBreadcrumbsPresenter.new(org_info, content_item)
  end

  def sort_presenter
    @sort_presenter ||= content_item.sorter_class.new(content_item, filter_params)
  end

  def pagination_presenter
    PaginationPresenter.new(
      per_page: content_item.default_documents_per_page,
      start_offset: search_results["start"],
      total_results: search_results["total"],
      url_builder: finder_url_builder,
    )
  end

  def search_results
    search_query.search_results
  end

  def spelling_suggestion_presenter
    suggested_queries = search_results.fetch("suggested_queries", [])
    SpellingSuggestionPresenter.new(
      suggested_queries,
      finder_url_builder.url(keywords: (suggested_queries.first || {})["text"]),
      # Search api is set to always return an array with one item
      content_item.as_hash["base_path"],
    )
  end

  def finder_url_builder
    UrlBuilder.new(content_item.base_path, filter_params)
  end

  def parent
    params.fetch(:parent, "")
  end

  def keywords
    filter_params["keywords"].presence
  end

  def facet_tags
    @facet_tags ||= FacetTagsPresenter.new(
      facets,
      sort_presenter,
      i_am_a_topic_page_finder:,
    )
  end

  def i_am_a_topic_page_finder
    @i_am_a_topic_page_finder ||= taxonomy_registry.taxonomy.key? params[:topic]
  end

  def taxonomy_registry
    Services.registries.all["full_topic_taxonomy"]
  end

  def organisation_registry
    Services.registries.all["organisations"]
  end

  def debug_score?
    params[:debug_score]
  end

  def include_ecommerce?
    # these pages cause a javascript error because of the number of
    # results, so disable ecommerce until we have a proper solution to
    # splitting big GA requests.
    %w[
      /government/groups
      /world/organisations
      /government/organisations/hm-revenue-customs/contact
    ].exclude?(content_item.base_path)
  end

  def legacy_params_present?
    legacy_params = %i[
      departments
      from_date
      official_document_status
      publication_filter_option
      publication_type
      subtaxons
      taxons
      to_date
    ].freeze
    given_params = params.keys.map(&:to_sym)

    (legacy_params & given_params).any?
  end

  def transform_legacy_announcement_params_and_redirect
    base_path = "/search/news-and-communications"
    query_string = legacy_finder_query_params.to_query

    redirect_path = if query_string.empty?
                      base_path
                    else
                      "#{base_path}?#{query_string}"
                    end

    redirect_to redirect_path and return
  end

  def transform_legacy_publication_params_and_redirect
    default_publications_path = "/search/all"

    publications_routes = {
      "command_and_act_papers" => {
        base_path: "/official-documents",
      },
      "command_papers" => {
        base_path: "/official-documents",
        special_params: {
          content_store_document_type: "command_papers",
        },
      },
      "act_papers" => {
        base_path: "/official-documents",
        special_params: {
          content_store_document_type: "act_papers",
        },
      },
      "consultations" => {
        base_path: "/search/policy-papers-and-consultations",
        special_params: {
          content_store_document_type: %w[open_consultations closed_consultations],
        },
      },
      "closed-consultations" => {
        base_path: "/search/policy-papers-and-consultations",
        special_params: {
          content_store_document_type: "closed_consultations",
        },
      },
      "open-consultations" => {
        base_path: "/search/policy-papers-and-consultations",
        special_params: {
          content_store_document_type: "open_consultations",
        },
      },
      "foi-releases" => {
        base_path: "/search/transparency-and-freedom-of-information-releases",
        special_params: {
          content_store_document_type: "foi_release",
        },
      },
      "transparency-data" => {
        base_path: "/search/transparency-and-freedom-of-information-releases",
        special_params: {
          content_store_document_type: "transparency",
        },
      },
      "corporate-reports" => {
        base_path: "/search/transparency-and-freedom-of-information-releases",
        special_params: {
          content_store_document_type: "corporate_report",
        },
      },
      "guidance" => {
        base_path: "/search/guidance-and-regulation",
      },
      "regulations" => {
        base_path: "/search/guidance-and-regulation",
      },
      "policy-papers" => {
        base_path: "/search/policy-papers-and-consultations",
        special_params: {
          content_store_document_type: "policy_papers",
        },
      },
      "forms" => {
        base_path: "/search/services",
      },
      "research-and-analysis" => {
        base_path: "/search/research-and-statistics",
        special_params: {
          content_store_document_type: "research",
        },
      },
      "statistics" => {
        base_path: "/search/research-and-statistics",
      },
    }

    base_path = publications_routes.dig(publication_finder_type, :base_path) || default_publications_path
    special_params = publications_routes.dig(publication_finder_type, :special_params) || {}
    query_string = legacy_finder_query_params.merge(special_params).to_query

    redirect_path = if query_string.empty?
                      base_path
                    else
                      "#{base_path}?#{query_string}"
                    end

    redirect_to redirect_path and return
  end

  def publication_finder_type
    params[:official_document_status] || params[:publication_filter_option] || params[:publication_type]
  end

  def legacy_finder_query_params
    level_one_taxon = params[:taxons].try(:first) || params[:topics].try(:first)
    level_two_taxon = params[:subtaxons].try(:first)
    level_one_taxon = nil if level_one_taxon == "all"
    level_two_taxon = nil if level_two_taxon == "all"

    {
      keywords: params[:keywords],
      level_one_taxon:,
      level_two_taxon:,
      organisations: filter_query_array(params[:departments] || params[:organisations]),
      people: filter_query_array(params[:people]),
      public_timestamp: { from: params[:from_date], to: params[:to_date] }.compact.presence,
      roles: filter_query_array(params[:roles]),
      topical_events: filter_query_array(params[:topical_events]),
      world_locations: filter_query_array(params[:world_locations]),
    }.compact
  end

  def filter_query_array(arr)
    if arr.respond_to? "reject"
      arr.reject { |v| v == "all" }.compact.presence
    end
  end
end
