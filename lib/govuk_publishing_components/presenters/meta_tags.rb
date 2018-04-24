module GovukPublishingComponents
  module Presenters
    class MetaTags
      attr_reader :content_item, :details, :links, :local_assigns

      def initialize(content_item, local_assigns)
        # We have to call deep_symbolize_keys because we're often dealing with a
        # parsed JSON document which will have string keys by default, but our
        # components use symbol keys and we want consistency.
        @content_item = content_item.to_h.deep_symbolize_keys
        @details = @content_item[:details] || {}
        @links = @content_item[:links] || {}
        @local_assigns = local_assigns
      end

      def meta_tags
        meta_tags = {}

        meta_tags = add_document_type_tags(meta_tags)

        meta_tags["govuk:content-id"] = content_item[:content_id] if content_item[:content_id]
        meta_tags["govuk:withdrawn"] = "withdrawn" if content_item[:withdrawn_notice].present?

        meta_tags = add_organisation_tags(meta_tags)
        meta_tags = add_political_tags(meta_tags)
        meta_tags = add_taxonomy_tags(meta_tags)

        meta_tags["govuk:content-has-history"] = "true" if has_content_history?

        meta_tags["govuk:static-analytics:strip-postcodes"] = "true" if should_strip_postcode_pii?(content_item, local_assigns)

        meta_tags = add_step_by_step_tags(meta_tags)

        meta_tags
      end

    private

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
          root_taxon_set << content_item[:base_path].sub(%r(^/), '') if content_item[:document_type] == 'taxon'
        else
          parent_taxons.each do |parent_taxon|
            root_taxon_set += root_taxon_slugs(parent_taxon)
          end
        end

        root_taxon_set
      end

      def should_strip_postcode_pii?(content_item, local_assigns)
        # allow override if we explicitly want to strip pii (or not) regardless of
        # document_type
        return local_assigns[:strip_postcode_pii] if local_assigns.key?(:strip_postcode_pii)

        formats_that_might_include_postcodes = [
          'smart_answer',
          'search'
        ]
        formats_that_might_include_postcodes.include?(content_item[:document_type])
      end

      def add_taxonomy_tags(meta_tags)
        themes = root_taxon_slugs(content_item)
        meta_tags["govuk:themes"] = themes.to_a.sort.join(', ') unless themes.empty?

        if content_item[:document_type] == 'taxon'
          taxons = [content_item]
        else
          taxons = links[:taxons] || []
        end

        taxons.sort_by! { |taxon| taxon[:title] }
        taxon_slugs_without_theme = taxons.map do |taxon|
          base_path = taxon[:base_path] || ""
          slug_without_theme = base_path[%r{/[^/]+/(.+)}, 1]
          # Return the slug without the theme, or in the special case of a root taxon,
          # just return the full slug (because it doesn't have a slug beneath the theme)
          slug_without_theme || base_path.sub(%r(^/), '')
        end
        taxon_ids = taxons.map { |taxon| taxon[:content_id] }

        meta_tags["govuk:taxon-id"] = taxon_ids.first unless taxon_ids.empty?
        meta_tags["govuk:taxon-ids"] = taxon_ids.join(',') unless taxon_ids.empty?
        meta_tags["govuk:taxon-slug"] = taxon_slugs_without_theme.first unless taxon_slugs_without_theme.empty?
        meta_tags["govuk:taxon-slugs"] = taxon_slugs_without_theme.join(',') unless taxon_slugs_without_theme.empty?
        meta_tags
      end

      def add_step_by_step_tags(meta_tags)
        stepnavs = links[:part_of_step_navs] || []
        stepnavs_content = stepnavs.map { |stepnav| stepnav[:content_id] }.join(",")
        meta_tags["govuk:stepnavs"] = stepnavs_content if stepnavs_content.present?
        meta_tags
      end

      def add_document_type_tags(meta_tags)
        meta_tags["govuk:format"] = content_item[:document_type] if content_item[:document_type]
        meta_tags["govuk:schema-name"] = content_item[:schema_name] if content_item[:schema_name]

        user_journey_stage = content_item[:user_journey_document_supertype]
        meta_tags["govuk:user-journey-stage"] = user_journey_stage if user_journey_stage

        navigation_document_type = content_item[:navigation_document_supertype]
        meta_tags["govuk:navigation-document-type"] = navigation_document_type if navigation_document_type

        meta_tags
      end

      def add_organisation_tags(meta_tags)
        organisations = []
        organisations += links[:organisations] || []
        organisations += links[:worldwide_organisations] || []
        organisations_content = organisations.map { |link| "<#{link[:analytics_identifier]}>" }.uniq.join
        meta_tags["govuk:analytics:organisations"] = organisations_content if organisations.any?

        world_locations = links[:world_locations] || []
        world_locations_content = world_locations.map { |link| "<#{link[:analytics_identifier]}>" }.join
        meta_tags["govuk:analytics:world-locations"] = world_locations_content if world_locations.any?

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
    end
  end
end
