require "spec_helper"
require "action_view"

RSpec.describe GovukPublishingComponents::Presenters::StepByStepNavHelper do
  include ActionView::Helpers::SanitizeHelper

  describe "Step by step navigation helper" do
    step_helper = described_class.new

    it "generates step nav ids correctly" do
      id = step_helper.generate_step_nav_id("This isn't a real step title - numb3rs okay?")
      expect(id).to eql("this-isn-t-a-real-step-title-numb3rs-okay")
    end

    it "generates a paragraph" do
      paragraph = step_helper.render_step_nav_element({ type: "paragraph", text: "Some text" }, {})
      expect(paragraph).to eql('<p class="gem-c-step-nav__paragraph">Some text</p>')
    end

    it "generates a basic list" do
      contents = [{ text: "Link 1", href: "/link1" }]
      options = { link_index: 0, step_index: 0, step_nav_content_id: "this-is-an-id" }
      list = step_helper.render_step_nav_element({ type: "list", contents: }, options)

      expect(list).to eql('<ol class="gem-c-step-nav__list " data-length="1"><li class="gem-c-step-nav__list-item js-list-item "><a data-position="1.1" class="gem-c-step-nav__link js-link" href="/link1?step-by-step-nav=this-is-an-id">Link 1 </a></li></ol>')
    end

    it "generates a choice list" do
      contents = [{ text: "Link 1", href: "/link1" }]
      options = { link_index: 0, step_index: 0, step_nav_content_id: "this-is-an-id" }
      list = step_helper.render_step_nav_element({ type: "list", contents:, style: "choice" }, options)

      expect(list).to eql('<ul class="gem-c-step-nav__list gem-c-step-nav__list--choice" data-length="1"><li class="gem-c-step-nav__list-item js-list-item "><a data-position="1.1" class="gem-c-step-nav__link js-link" href="/link1?step-by-step-nav=this-is-an-id">Link 1 </a></li></ul>')
    end

    it "generates a list with multiple items and correct link and step indexing attributes" do
      contents = [{ text: "Link 1", href: "/link1" }, { text: "Link 2", href: "/link2" }, { text: "Link 3", href: "/link3" }]
      options = { link_index: 3, step_index: 2, step_nav_content_id: "this-is-an-id" }
      list = step_helper.render_step_nav_element({ type: "list", contents: }, options)

      expect(list).to eql('<ol class="gem-c-step-nav__list " data-length="3"><li class="gem-c-step-nav__list-item js-list-item "><a data-position="3.4" class="gem-c-step-nav__link js-link" href="/link1?step-by-step-nav=this-is-an-id">Link 1 </a></li><li class="gem-c-step-nav__list-item js-list-item "><a data-position="3.5" class="gem-c-step-nav__link js-link" href="/link2?step-by-step-nav=this-is-an-id">Link 2 </a></li><li class="gem-c-step-nav__list-item js-list-item "><a data-position="3.6" class="gem-c-step-nav__link js-link" href="/link3?step-by-step-nav=this-is-an-id">Link 3 </a></li></ol>')
    end

    it "generates a list with external links marked appropriately" do
      contents = [{ text: "Link 1", href: "https://www.gov.uk" }, { text: "Link 2", href: "/link2" }]
      options = { link_index: 0, step_index: 0, step_nav_content_id: "this-is-an-id" }
      list = step_helper.render_step_nav_element({ type: "list", contents: }, options)

      expect(list).to eql('<ol class="gem-c-step-nav__list " data-length="2"><li class="gem-c-step-nav__list-item js-list-item "><a rel="external" data-position="1.1" class="gem-c-step-nav__link js-link" href="https://www.gov.uk">Link 1 </a></li><li class="gem-c-step-nav__list-item js-list-item "><a data-position="1.2" class="gem-c-step-nav__link js-link" href="/link2?step-by-step-nav=this-is-an-id">Link 2 </a></li></ol>')
    end

    it "generates a list with contexts" do
      contents = [{ text: "Link 1", href: "/link1", context: "37p" }]
      options = { link_index: 0, step_index: 0, step_nav_content_id: "this-is-an-id" }
      list = step_helper.render_step_nav_element({ type: "list", contents: }, options)

      expect(list).to eql('<ol class="gem-c-step-nav__list " data-length="1"><li class="gem-c-step-nav__list-item js-list-item "><a data-position="1.1" class="gem-c-step-nav__link js-link" href="/link1?step-by-step-nav=this-is-an-id">Link 1 <span class="gem-c-step-nav__context">37p</span></a></li></ol>')
    end

    it "generates a list with an active element" do
      contents = [{ text: "Link 1", href: "/link1" }, { text: "Link 2", href: "/link2", active: true }]
      options = { link_index: 0, step_index: 0, step_nav_content_id: "this-is-an-id" }
      list = step_helper.render_step_nav_element({ type: "list", contents: }, options)

      expect(list).to eql('<ol class="gem-c-step-nav__list " data-length="2"><li class="gem-c-step-nav__list-item js-list-item "><a data-position="1.1" class="gem-c-step-nav__link js-link" href="/link1?step-by-step-nav=this-is-an-id">Link 1 </a></li><li class="gem-c-step-nav__list-item js-list-item gem-c-step-nav__list-item--active"><a data-position="1.2" class="gem-c-step-nav__link js-link" href="#content"><span class="gem-c-step-nav__link-active-context visuallyhidden">You are currently viewing: </span>Link 2 </a></li></ol>')
    end
  end
end
