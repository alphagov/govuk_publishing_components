require 'active_model'

class AdminController < ApplicationController
  layout 'admin'

  before_action do
    response.headers[Slimmer::Headers::SKIP_HEADER] = "true"
  end

  class ExampleObject
    include ActiveModel::Model

    attr_reader :name_with_existing_value,
      :name_without_existing_value,
      :some_yes_no_question,
      :some_long_text,
      :password,
      :choose_a_number,
      :choose_some_numbers,
      :choose_another_number

    def name_with_existing_value
      @name_with_existing_value ||= "Already in the database"
    end
  end

  def index; end

  def form
    @object = ExampleObject.new
  end

  def admin_controller_example_objects_path(*)
    '#'
  end

  helper_method :admin_controller_example_objects_path
end
