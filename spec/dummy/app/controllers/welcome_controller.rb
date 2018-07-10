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
      "Guidance with a policy" => "/government/publications/helping-british-nationals-overseas-our-service-on-twitter-fcotravel--2",
    }

    if params[:base_path]
      @content_item = Services.content_store.content_item("/" + params[:base_path])
    end
  end

  def admin
    response.headers[Slimmer::Headers::SKIP_HEADER] = "true"
    render 'admin_example', layout: 'dummy_admin_layout'
  end
end
