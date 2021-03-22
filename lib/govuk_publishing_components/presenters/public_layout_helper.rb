module GovukPublishingComponents
  module Presenters
    class PublicLayoutHelper
      FOOTER_NAV = [
        {
          title: "Coronavirus (COVID-19)",
          columns: 2,
          items: [
            {
              href: "/coronavirus",
              text: "Coronavirus (COVID-19): guidance and support",
              attributes: {
                data: {
                  track_category: "footerClicked",
                  track_action: "coronavirusLinks",
                  track_label: "Coronavirus (COVID-19): guidance and support",
                },
              },
            },
          ],
        },
        {
          title: "Brexit",
          columns: 1,
          items: [
            {
              href: "/transition",
              text: "Check what you need to do",
              attributes: {
                data: {
                  track_category: "footerClicked",
                  track_action: "transitionLinks",
                  track_label: "Check what you need to do",
                },
              },
            },
          ],
        },
        {
          title: "Services and information",
          columns: 2,
          items: [
            {
              href: "/browse/benefits",
              text: "Benefits",
              attributes: {
                data: {
                  track_category: "footerClicked",
                  track_action: "footerLinks",
                  track_label: "Benefits",
                },
              },
            },
            {
              href: "/browse/births-deaths-marriages",
              text: "Births, deaths, marriages and care",
              attributes: {
                data: {
                  track_category: "footerClicked",
                  track_action: "footerLinks",
                  track_label: "Births, deaths, marriages and care",
                },
              },
            },
            {
              href: "/browse/business",
              text: "Business and self-employed",
              attributes: {
                data: {
                  track_category: "footerClicked",
                  track_action: "footerLinks",
                  track_label: "Business and self-employed",
                },
              },
            },
            {
              href: "/browse/childcare-parenting",
              text: "Childcare and parenting",
              attributes: {
                data: {
                  track_category: "footerClicked",
                  track_action: "footerLinks",
                  track_label: "Childcare and parenting",
                },
              },
            },
            {
              href: "/browse/citizenship",
              text: "Citizenship and living in the UK",
              attributes: {
                data: {
                  track_category: "footerClicked",
                  track_action: "footerLinks",
                  track_label: "Citizenship and living in the UK",
                },
              },
            },
            {
              href: "/browse/justice",
              text: "Crime, justice and the law",
              attributes: {
                data: {
                  track_category: "footerClicked",
                  track_action: "footerLinks",
                  track_label: "Crime, justice and the law",
                },
              },
            },
            {
              href: "/browse/disabilities",
              text: "Disabled people",
              attributes: {
                data: {
                  track_category: "footerClicked",
                  track_action: "footerLinks",
                  track_label: "Disabled people",
                },
              },
            },
            {
              href: "/browse/driving",
              text: "Driving and transport",
              attributes: {
                data: {
                  track_category: "footerClicked",
                  track_action: "footerLinks",
                  track_label: "Driving and transport",
                },
              },
            },
            {
              href: "/browse/education",
              text: "Education and learning",
              attributes: {
                data: {
                  track_category: "footerClicked",
                  track_action: "footerLinks",
                  track_label: "Education and learning",
                },
              },
            },
            {
              href: "/browse/employing-people",
              text: "Employing people",
              attributes: {
                data: {
                  track_category: "footerClicked",
                  track_action: "footerLinks",
                  track_label: "Employing people",
                },
              },
            },
            {
              href: "/browse/environment-countryside",
              text: "Environment and countryside",
              attributes: {
                data: {
                  track_category: "footerClicked",
                  track_action: "footerLinks",
                  track_label: "Environment and countryside",
                },
              },
            },
            {
              href: "/browse/housing-local-services",
              text: "Housing and local services",
              attributes: {
                data: {
                  track_category: "footerClicked",
                  track_action: "footerLinks",
                  track_label: "Housing and local services",
                },
              },
            },
            {
              href: "/browse/tax",
              text: "Money and tax",
              attributes: {
                data: {
                  track_category: "footerClicked",
                  track_action: "footerLinks",
                  track_label: "Money and tax",
                },
              },
            },
            {
              href: "/browse/abroad",
              text: "Passports, travel and living abroad",
              attributes: {
                data: {
                  track_category: "footerClicked",
                  track_action: "footerLinks",
                  track_label: "Passports, travel and living abroad",
                },
              },
            },
            {
              href: "/browse/visas-immigration",
              text: "Visas and immigration",
              attributes: {
                data: {
                  track_category: "footerClicked",
                  track_action: "footerLinks",
                  track_label: "Visas and immigration",
                },
              },
            },
            {
              href: "/browse/working",
              text: "Working, jobs and pensions",
              attributes: {
                data: {
                  track_category: "footerClicked",
                  track_action: "footerLinks",
                  track_label: "Working, jobs and pensions",
                },
              },
            },
          ],
        },
        {
          title: "Departments and policy",
          items: [
            {
              href: "/government/how-government-works",
              text: "How government works",
              attributes: {
                data: {
                  track_category: "footerClicked",
                  track_action: "footerLinks",
                  track_label: "How government works",
                },
              },
            },
            {
              href: "/government/organisations",
              text: "Departments",
              attributes: {
                data: {
                  track_category: "footerClicked",
                  track_action: "footerLinks",
                  track_label: "Departments",
                },
              },
            },
            {
              href: "/world",
              text: "Worldwide",
              attributes: {
                data: {
                  track_category: "footerClicked",
                  track_action: "footerLinks",
                  track_label: "Worldwide",
                },
              },
            },
            {
              href: "/search/services",
              text: "Services",
              attributes: {
                data: {
                  track_category: "footerClicked",
                  track_action: "footerLinks",
                  track_label: "Services",
                },
              },
            },
            {
              href: "/search/guidance-and-regulation",
              text: "Guidance and regulation",
              attributes: {
                data: {
                  track_category: "footerClicked",
                  track_action: "footerLinks",
                  track_label: "Guidance and regulation",
                },
              },
            },
            {
              href: "/search/news-and-communications",
              text: "News and communications",
              attributes: {
                data: {
                  track_category: "footerClicked",
                  track_action: "footerLinks",
                  track_label: "News and communications",
                },
              },
            },
            {
              href: "/search/research-and-statistics",
              text: "Research and statistics",
              attributes: {
                data: {
                  track_category: "footerClicked",
                  track_action: "footerLinks",
                  track_label: "Research and statistics",
                },
              },
            },
            {
              href: "/search/policy-papers-and-consultations",
              text: "Policy papers and consultations",
              attributes: {
                data: {
                  track_category: "footerClicked",
                  track_action: "footerLinks",
                  track_label: "Policy papers and consultations",
                },
              },
            },
            {
              href: "/search/transparency-and-freedom-of-information-releases",
              text: "Transparency and freedom of information releases",
              attributes: {
                data: {
                  track_category: "footerClicked",
                  track_action: "footerLinks",
                  track_label: "Transparency and freedom of information releases",
                },
              },
            },
          ],
        },
      ].freeze

      FOOTER_META = {
        items: [
          {
            href: "/help",
            text: "Help",
          },
          {
            href: "/help/cookies",
            text: "Cookies",
          },
          {
            href: "/contact",
            text: "Contact",
          },
          {
            href: "/help/terms-conditions",
            text: "Terms and conditions",
          },
          {
            href: "/cymraeg",
            text: "Rhestr o Wasanaethau Cymraeg",
          },
          {
            href: "/government/organisations/government-digital-service",
            text: "Government Digital Service",
          },
        ],
      }.freeze

      attr_reader :footer_navigation, :footer_meta

      def initialize(local_assigns)
        @footer_navigation = local_assigns[:footer_navigation] || FOOTER_NAV
        @footer_meta = local_assigns[:footer_meta] || FOOTER_META
      end
    end
  end
end
