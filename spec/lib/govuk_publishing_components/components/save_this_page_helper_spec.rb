require "spec_helper"

RSpec.describe GovukPublishingComponents::Presenters::SaveThisPageHelper do
  describe "Shared component helper" do
    context "form action" do
      it "uses save endpoint by default" do
        save_page = GovukPublishingComponents::Presenters::SaveThisPageHelper.new({})
        expect(save_page.form_action).to eql("/placeholder-for-save")
        expect(save_page.button_text).to eql(I18n.t("components.save_this_page.add_page_button"))
      end

      it "uses save endpoint when user is signed out" do
        save_page = GovukPublishingComponents::Presenters::SaveThisPageHelper.new({ signed_in: false })
        expect(save_page.form_action).to eql("/placeholder-for-save")
        expect(save_page.button_text).to eql(I18n.t("components.save_this_page.add_page_button"))
      end

      it "uses save endpoint when user is signed in and the current page was not saved" do
        save_page = GovukPublishingComponents::Presenters::SaveThisPageHelper.new({ signed_in: true })
        expect(save_page.form_action).to eql("/placeholder-for-save")
        expect(save_page.button_text).to eql(I18n.t("components.save_this_page.add_page_button"))
      end

      it "uses delete endpoint when user is signed in and the current page was already saved" do
        save_page = GovukPublishingComponents::Presenters::SaveThisPageHelper.new({ signed_in: true, page_is_saved: true })
        expect(save_page.form_action).to eql("/placeholder-for-delete")
        expect(save_page.button_text).to eql(I18n.t("components.save_this_page.remove_page_button"))
      end
    end

    context "component text" do
      it "displays CTA to save a page by default" do
        save_page = GovukPublishingComponents::Presenters::SaveThisPageHelper.new({})
        expect(save_page.heading_text).to eql(I18n.t("components.save_this_page.page_not_saved_heading"))
        expect(save_page.additional_text).to eql(I18n.t("components.save_this_page.see_saved_pages_signed_out", link: "/placeholder-sign-in-saved-pages"))
      end

      it "displays CTA to save a page when the user is logged in and has not saved the page" do
        save_page = GovukPublishingComponents::Presenters::SaveThisPageHelper.new({ signed_in: true })
        expect(save_page.heading_text).to eql(I18n.t("components.save_this_page.page_not_saved_heading"))
        expect(save_page.additional_text).to eql(I18n.t("components.save_this_page.see_saved_pages_signed_in", link: "/placeholder-saved-pages"))
      end

      it "displays appropriate information when the user is logged in and has already saved the page" do
        save_page = GovukPublishingComponents::Presenters::SaveThisPageHelper.new({ signed_in: true, page_is_saved: true })
        expect(save_page.heading_text).to eql(I18n.t("components.save_this_page.page_was_saved_heading"))
        expect(save_page.additional_text).to eql(I18n.t("components.save_this_page.see_saved_pages_signed_in", link: "/placeholder-saved-pages"))
      end
    end
  end
end
