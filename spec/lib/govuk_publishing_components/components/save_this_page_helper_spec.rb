require "spec_helper"

RSpec.describe GovukPublishingComponents::Presenters::SaveThisPageHelper do
  subject(:helper) { described_class.new(params) }
  let(:params) { {} }

  describe "Shared component helper" do
    describe "save page form" do
      let(:add_button_text) { I18n.t("components.save_this_page.add_page_button") }
      let(:remove_button_text) { I18n.t("components.save_this_page.remove_page_button") }
      let(:add_form_endpoint) { "/placeholder-for-save" }
      let(:remove_form_endpoint) { "/placeholder-for-delete" }

      context "by default" do
        it "uses 'save' endpoint" do
          expect(helper.form_action).to eql(add_form_endpoint)
        end

        it "uses 'add page' button" do
          expect(helper.button_text).to eql(add_button_text)
        end
      end

      context "when user is signed out" do
        let(:params) { { signed_in: false } }

        it "uses 'save' endpoint" do
          expect(helper.form_action).to eql(add_form_endpoint)
        end

        it "uses the 'add page' button" do
          expect(helper.button_text).to eql(add_button_text)
        end
      end

      context "when user is signed in and the current page was not saved" do
        let(:params) { { signed_in: true } }

        it "uses 'save' endpoint" do
          expect(helper.form_action).to eql(add_form_endpoint)
        end

        it "uses the 'add page' button" do
          expect(helper.button_text).to eql(add_button_text)
        end
      end

      context "when user is signed in and the current page was already saved" do
        let(:params) { { signed_in: true, page_is_saved: true } }

        it "uses 'delete' endpoint" do
          expect(helper.form_action).to eql(remove_form_endpoint)
        end

        it "uses 'remove page' button" do
          expect(helper.button_text).to eql(remove_button_text)
        end
      end
    end

    describe "component text" do
      let(:heading_text_add) { I18n.t("components.save_this_page.page_not_saved_heading") }
      let(:heading_text_remove) { I18n.t("components.save_this_page.page_was_saved_heading") }
      let(:saved_pages_signed_in_link_text) { I18n.t("components.save_this_page.see_saved_pages_signed_in", link: "/placeholder-saved-pages") }
      let(:saved_pages_signed_out_link_text) { I18n.t("components.save_this_page.see_saved_pages_signed_out", link: "/placeholder-sign-in-saved-pages") }

      context "by default" do
        it "displays CTA to save a page" do
          expect(helper.heading_text).to eql(heading_text_add)
        end

        it "prompts user to sign in to see their saved pages" do
          expect(helper.additional_text).to eql(saved_pages_signed_out_link_text)
        end
      end

      context "when the user is logged in and has not saved the page" do
        let(:params) { { signed_in: true } }

        it "displays a CTA to save the page" do
          expect(helper.heading_text).to eql(heading_text_add)
        end

        it "displays a link to their saved pages" do
          expect(helper.additional_text).to eql(saved_pages_signed_in_link_text)
        end
      end

      context "when the user is logged in and has already saved the page" do
        let(:params) { { signed_in: true, page_is_saved: true } }

        it "displays information that the page was saved" do
          expect(helper.heading_text).to eql(heading_text_remove)
        end

        it "displays a link to their saved pages" do
          expect(helper.additional_text).to eql(saved_pages_signed_in_link_text)
        end
      end
    end
  end
end
