module Helpers
  module Components
    def component_name
      raise NotImplementedError, "Override this method in your test class"
    end

    def render_component(locals)
      if block_given?
        render("govuk_publishing_components/components/#{component_name}", locals) { yield }
      else
        render "govuk_publishing_components/components/#{component_name}", locals
      end
    end
  end
end
