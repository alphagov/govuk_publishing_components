module Helpers
  module Components
    def component_name
      raise NotImplementedError, "Override this method in your test class"
    end

    def render_component(locals, &block)
      if block_given?
        render("govuk_publishing_components/components/#{component_name}", locals, &block)
      else
        render "govuk_publishing_components/components/#{component_name}", locals
      end
    end
  end
end
