require 'rails_helper'

describe "Contextual sidebar", type: :view do
  def component_name
    "contextual_sidebar"
  end

  it "displays the step by step sidebar if there's one"
  it "displays the related links if the page is tagged to a browse page"
  it "displays the taxonomy sidebar if the page is tagged to a live taxon"
  it "displays the legacy taxonomies if the page is tagged to any of them"
  it "displays nothing if there's nothing to show"
end
