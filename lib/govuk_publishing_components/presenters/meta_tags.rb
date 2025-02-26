module GovukPublishingComponents
  module Presenters
    class MetaTags
      FORMATS_THAT_MIGHT_INCLUDE_POSTCODES = %w[smart_answer finder local_transaction place special_route transaction].freeze

      attr_reader :content_item, :details, :links, :local_assigns, :request

      def initialize(content_item, local_assigns, request)
        # We have to call deep_symbolize_keys because we're often dealing with a
        # parsed JSON document which will have string keys by default, but our
        # components use symbol keys and we want consistency.
        @content_item = content_item.to_h.deep_symbolize_keys
        @details = @content_item[:details] || {}
        @links = @content_item[:links] || {}
        @local_assigns = local_assigns
        @request = request
      end

      def meta_tags
        meta_tags = {}
        meta_tags = add_core_tags(meta_tags)
        meta_tags = add_ga4_political_tags(meta_tags)
        meta_tags = add_organisation_tags(meta_tags)
        meta_tags = add_political_tags(meta_tags)
        meta_tags = add_taxonomy_tags(meta_tags)
        add_step_by_step_tags(meta_tags)
      end

    private

      # other meta tags are inserted by slimmer here:
      # https://github.com/alphagov/slimmer/blob/82144be372aa4afc1f8ff30917c96c2ee3a47ed8/lib/slimmer/processors/metadata_inserter.rb#L15
      def add_core_tags(meta_tags)
        meta_tags["govuk:format"] = content_item[:document_type] if content_item[:document_type]
        meta_tags["govuk:publishing-app"] = content_item[:publishing_app] if content_item[:publishing_app]
        meta_tags["govuk:rendering-app"] = content_item[:rendering_app] if content_item[:rendering_app]
        meta_tags["govuk:schema-name"] = content_item[:schema_name] if content_item[:schema_name]
        meta_tags["govuk:content-id"] = content_item[:content_id] if content_item[:content_id]
        meta_tags["govuk:navigation-page-type"] = content_item[:navigation_page_type] if content_item[:navigation_page_type]
        meta_tags["govuk:navigation-list-type"] = content_item[:navigation_list_type] if content_item[:navigation_list_type]
        meta_tags["govuk:section"] = content_item[:section] if content_item[:section]
        meta_tags["govuk:withdrawn"] = "withdrawn" if content_item[:withdrawn_notice].present?
        meta_tags["govuk:content-has-history"] = "true" if has_content_history?
        meta_tags["govuk:ga4-strip-dates"] = "true" if should_strip_dates_pii?(content_item, local_assigns)
        meta_tags["govuk:ga4-strip-postcodes"] = "true" if should_strip_postcode_pii?(content_item, local_assigns)
        meta_tags["govuk:first-published-at"] = content_item[:first_published_at] if content_item[:first_published_at]
        meta_tags["govuk:updated-at"] = content_item[:updated_at] if content_item[:updated_at]
        meta_tags["govuk:public-updated-at"] = content_item[:public_updated_at] if content_item[:public_updated_at]
        primary_publisher = content_item.dig(:links, :primary_publishing_organisation)
        primary_publisher = primary_publisher.first[:title] if primary_publisher.present?
        meta_tags["govuk:primary-publishing-organisation"] = primary_publisher if primary_publisher.present?

        # Some browse topics are nested in the content item, we want to grab these for GA4 tracking.
        ga4_browse_topic = content_item.dig(:links, :ordered_related_items, 0, :links, :mainstream_browse_pages, 0, :links, :parent, 0, :title)
        ga4_browse_topic = ga4_browse_topic.downcase if ga4_browse_topic
        meta_tags["govuk:ga4-browse-topic"] = ga4_browse_topic if ga4_browse_topic

        meta_tags
      end

      def add_organisation_tags(meta_tags)
        organisations = []
        organisations += [content_item] if content_item[:document_type] == "organisation"
        organisations += links[:organisations] || []
        organisations += links[:worldwide_organisations] || []
        organisations_content = organisations.map { |link| "<#{link[:analytics_identifier]}>" }.uniq.join
        meta_tags["govuk:organisations"] = organisations_content if organisations.any?

        world_locations = links[:world_locations] || []
        world_locations_content = world_locations.map { |link| "<#{link[:analytics_identifier]}>" }.join
        meta_tags["govuk:world-locations"] = world_locations_content if world_locations.any?

        meta_tags
      end

      def add_political_tags(meta_tags)
        if details.key?(:political) && details.key?(:government)
          political_status = "non-political"
          if details[:political]
            political_status = details[:government][:current] ? "political" : "historic"
          end

          meta_tags["govuk:political-status"] = political_status
          meta_tags["govuk:publishing-government"] = details[:government][:slug]
        end

        meta_tags
      end

      # Some 'government' objects are nested in the content item on some pages. We want to grab these for GA4 tracking.
      # We only add the publishing government if 'political' is true, otherwise some content items get incorrectly linked to a government
      def add_ga4_political_tags(meta_tags)
        government = content_item.dig(:links, :government, 0)

        # political: true/false is in a different place to current: true/false, which is why we have 'details' and 'government.dig(:details)'
        if government && details[:political]
          current_government = government.dig(:details, :current)
          unless current_government
            meta_tags["govuk:ga4-political-status"] = "historic"
            meta_tags["govuk:ga4-publishing-government"] = government[:title] if government[:title]
          end
        end

        meta_tags
      end

      def add_taxonomy_tags(meta_tags)
        themes = root_taxon_slugs(content_item)
        meta_tags["govuk:taxonomy_level1"] = themes.to_a.sort.join(", ") unless themes.empty?

        taxons = if content_item[:document_type] == "taxon"
                   [content_item]
                 else
                   links[:taxons] || []
                 end

        taxons.sort_by! { |taxon| taxon[:title] }
        taxon_slugs_without_theme = taxons.map do |taxon|
          base_path = taxon[:base_path] || ""
          slug_without_theme = base_path[%r{/[^/]+/(.+)}, 1]
          # Return the slug without the theme, or in the special case of a root taxon,
          # just return the full slug (because it doesn't have a slug beneath the theme)
          slug_without_theme || base_path.sub(%r{^/}, "")
        end
        taxon_ids = taxons.map { |taxon| taxon[:content_id] }

        meta_tags["govuk:taxon-id"] = taxon_ids.first unless taxon_ids.empty?
        meta_tags["govuk:taxon-ids"] = taxon_ids.join(",") unless taxon_ids.empty?
        meta_tags["govuk:taxon-slug"] = taxon_slugs_without_theme.first unless taxon_slugs_without_theme.empty?
        meta_tags["govuk:taxon-slugs"] = taxon_slugs_without_theme.join(",") unless taxon_slugs_without_theme.empty?
        meta_tags
      end

      def add_step_by_step_tags(meta_tags)
        stepnavs = links[:part_of_step_navs] || []
        stepnavs_content = stepnavs.map { |stepnav| stepnav[:content_id] }.join(",")
        meta_tags["govuk:stepnavs"] = stepnavs_content if stepnavs_content.present?

        step_nav_helper = PageWithStepByStepNavigation.new(content_item, request.path, request.query_parameters)
        if step_nav_helper.show_secondary_step_by_step?
          meta_tags["govuk:navigation-page-type"] = "Secondary step by step shown"
        elsif step_nav_helper.show_header?
          meta_tags["govuk:navigation-page-type"] = "Primary step by step shown"
        end

        meta_tags
      end

      def has_content_history?
        (content_item[:public_updated_at] && details[:first_public_at] && content_item[:public_updated_at] != details[:first_public_at]) ||
          (details[:change_history] && details[:change_history].size > 1)
      end

      def root_taxon_slugs(content_item)
        root_taxon_set = Set.new

        links = content_item[:links]
        # Taxons will have :parent_taxons, but content items will have :taxons
        parent_taxons = links[:parent_taxons] || links[:taxons] unless links.nil?

        if parent_taxons.blank?
          root_taxon_set << content_item[:base_path].sub(%r{^/}, "") if content_item[:document_type] == "taxon"
        else
          parent_taxons.each do |parent_taxon|
            root_taxon_set += root_taxon_slugs(parent_taxon)
          end
        end

        root_taxon_set
      end

      def should_strip_dates_pii?(content_item, local_assigns)
        # allow override if we explicitly want to strip pii (or not) regardless of
        # document_type
        return local_assigns[:strip_dates_pii] if local_assigns.key?(:strip_dates_pii)

        formats_that_might_include_dates = %w[smart_answer]
        formats_that_might_include_dates.include?(content_item[:document_type])
      end

      def should_strip_postcode_pii?(content_item, local_assigns)
        # allow override if we explicitly want to strip pii (or not) regardless of
        # document_type
        return local_assigns[:strip_postcode_pii] if local_assigns.key?(:strip_postcode_pii)

        FORMATS_THAT_MIGHT_INCLUDE_POSTCODES.include?(content_item[:document_type])
      end
    end
  end
end
