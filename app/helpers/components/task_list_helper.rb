module Components
  module TaskListHelper
    # id should be lowercase, contain only numbers and letters and replace spaces with dashes
    def generate_id(step_title)
      step_title.downcase.tr(" ","-").gsub(/[^a-z0-9\-\s]/i, '')
    end

  end
end
