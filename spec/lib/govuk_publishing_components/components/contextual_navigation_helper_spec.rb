RSpec.describe GovukPublishingComponents::Presenters::ContextualNavigation do
  describe "Contextual navigation component helper" do
    before(:each) do
      class FakeRequest
        def initialise
        end

        def path
          "/"
        end

        def query_parameters
          {}
        end
      end
      @request = FakeRequest.new()

      @content_item = {
        title: "A content item",
        base_path: "/",
        links: {
          ordered_related_items: [
            {
              title: "Find an apprenticeship",
              base_path: "/apply-apprenticeship"
            },
            {
              title: "Training and study at work",
              base_path: "/training-study-work-your-rights"
            },
            {
              title: "Careers helpline for teenagers",
              base_path: "/careers-helpline-for-teenagers"
            }
          ],
          document_collections: [
            {
              title: "Recruit an apprentice (formerly apprenticeship vacancies)",
              base_path: "/government/collections/apprenticeship-vacancies",
              document_type: "document_collection"
            },
            {
              title: "The future of jobs and skills",
              base_path: "/government/collections/the-future-of-jobs-and-skills",
              document_type: "document_collection"
            }
          ]
        }
      }
    end

    it "can count links" do
      helper = GovukPublishingComponents::Presenters::ContextualNavigation.new(@content_item, @request)
      total_links = helper.total_links
      expect(total_links).to eql(5)
    end
  end
end
