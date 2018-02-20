module Helpers
  module Components
    def component_name
      raise NotImplementedError, "Override this method in your test class"
    end

    def render_component(locals)
      render partial: "govuk_publishing_components/components/#{component_name}", locals: locals
    end
  end
end
