module GovukPublishingComponents
  module Presenters
    class OrganisationSchema
      attr_reader :page

      def initialize(page)
        @page = page
      end

      def structured_data
        # http://schema.org/GovernmentOrganization
        {
          "@context" => "http://schema.org",
          "@type" => "GovernmentOrganization",
          "mainEntityOfPage" => {
            "@type" => "WebPage",
            "@id" => page.canonical_url,
          },
          "name" => page.title,
          "description" => page.description || page.body,
        }
        .merge(govuk_logo)
        .merge(members)
        .merge(parent_organisations)
        .merge(sub_organisations)
        .merge(search_action)
      end

    private

      def members
        return {} unless ministers.present?

        members = ministers_with_grouped_roles.map do |person, roles|
          person.merge("hasOccupation" => roles)
        end

        {
          "member" => members,
        }
      end

      def ministers
        page.content_item.dig("details", "ordered_ministers") || []
      end

      def ministers_with_grouped_roles
        ministers.each_with_object({}) do |minister, grouped|
          person_schema = person_schema_for_minister(minister)

          if grouped.key? person_schema
            grouped[person_schema] << role_for_minister(minister)
          else
            grouped[person_schema] = [role_for_minister(minister)]
          end
        end
      end

      def person_schema_for_minister(minister)
        {
          "@type" => "Person",
          "honorificPrefix" => minister["name_prefix"],
          "image" => minister.dig("image", "url"),
          "name" => minister["name"],
          "url" => minister_url(minister),
        }
      end

      def role_for_minister(minister)
        return {} unless minister["role"].present?

        {
          "@type" => "Role",
          "name" => minister["role"],
          "url" => role_url(minister),
        }
      end

      def minister_url(minister)
        "#{website_root}#{minister['href']}"
      end

      def role_url(minister)
        "#{website_root}#{minister['role_href']}"
      end

      def govuk_logo
        logo = page.local_assigns[:logo_url]
        return {} unless logo

        {
          "logo" => logo,
        }
      end

      def website_root
        @website_root ||= Plek.new.website_root
      end

      def parent_organisations
        related_organisations("ordered_parent_organisations", "parentOrganization")
      end

      def sub_organisations
        related_organisations("ordered_child_organisations", "subOrganization")
      end

      def related_organisations(link_type, schema_name)
        organisations = page.content_item.dig("links", link_type)

        return {} unless organisations.present?

        related_orgs = organisations.map do |org|
          page = Page.new(content_item: org)
          linked_org(page.canonical_url)
        end

        {
          schema_name => related_orgs,
        }
      end

      def linked_org(url)
        {
          "@context" => "http://schema.org",
          "@type" => "GovernmentOrganization",
          "sameAs" => url,
        }
      end

      def search_action
        PotentialSearchActionSchema.new(organisation_facet_params, search_description).structured_data
      end

      def slug
        uri = URI.parse(page.canonical_url)
        File.basename(uri.path)
      end

      def search_description
        I18n.t(:all_content_search_description, scope: %i[components organisation_schema], organisation: page.title)
      end

      def organisation_facet_params
        { organisations: [slug] }
      end
    end
  end
end
