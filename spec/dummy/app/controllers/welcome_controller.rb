class WelcomeController < ApplicationController
  def contextual_navigation
    @urls = {
      "HMRC org page (no navigation)" => "/government/organisations/hm-revenue-customs",
      "Mainstream browse page with related links" => "/complain-independent-case-examiner",
      "Vehicles you can drive (with step by step)" => "/vehicles-can-drive",
      "Corporation tax (related links)" => "/corporation-tax",
      "Guidance tagged to the education taxonomy" => "/guidance/teachers-student-loan-reimbursement-guidance-for-teachers-and-schools",
      "Travel advice Afghanistan" => "/foreign-travel-advice/afghanistan",
      "HMRC contact" => "/government/organisations/hm-revenue-customs/contact/agent-dedicated-line-self-assessment-or-paye-for-individuals",
      "AAIB report (specialist document)" => "/aaib-reports/aaib-investigation-to-airbus-helicopters-ec120b-colibri-g-swng",
    }

    if params[:base_path]
      @content_item = Services.content_store.content_item("/#{params[:base_path]}")
    end
  end

  def admin
    render "admin_example", layout: "dummy_admin_layout"
  end

  def public
    render "public_example", layout: "dummy_public_layout"
  end

  def tabsexample
    render "tabs_example", layout: "dummy_admin_layout"
  end

  def accordionexample
    render "accordion_example", layout: "dummy_admin_layout"
  end

  def metadatawithnoticeexample
    render "metadata_with_notice_example", layout: "dummy_public_layout"
  end

  def errorsummary
    render "error_summary", layout: "dummy_admin_layout"
  end

  def asset_helper
    render "asset_helper", layout: "asset_helper_layout"
  end

  def asset_helper_with_app_component
    render "asset_helper_with_app_component", layout: "asset_helper_layout"
  end

  def asset_helper_with_app_view
    render "asset_helper_with_app_view", layout: "asset_helper_layout"
  end
end
