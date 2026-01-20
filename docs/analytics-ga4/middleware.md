# Using our GA4 optimisation middleware in your application

GA4 data attributes may be quite large in the generated HTML code. This is because the attributes
contain JSON, which has a lot of double quotes. By default these are escaped in the rails stack, resulting
in each double quote being expanded into six characters: `&quot;`. This can add up, especially
in long lists of tracked links like the footer or the super navigation header.

The GovukPublishingComponents::Middleware::Ga4Optimise class manipulates the generated HTML to replace
these escaped attributes with single-quotes, which maintains valid HTML while reducing the size of the
output page. The middleware will only optimise a [fixed list of data attributes](../../lib/govuk_publishing_components/middleware/ga4_optimise.rb).

To use it, you will need to require it (it's not required by default, since not all apps will need
it), then add the middleware in your `config/application.rb` file.

```
require "govuk_publishing_components/middleware/ga4_optimise"

module MyFrontendApp
  class Application < Rails::Application
    #...etc...

    config.middleware.use GovukPublishingComponents::Middleware::Ga4Optimise
  end
end
```

