# Using our GA4 optimisation middleware in your application

If you are a developer on GOV.UK working on an app that does not use the slimmer gem, ga4 data
attributes will be quite large in the generated HTML code. This is because the attributes contain
JSON, which has a lot of double quotes. By default these are escaped in the rails stack, resulting
in each double quote being expanded into six characters: `&quot;`. This can add up, especially
in long lists of tracked links like the footer or the super navigation header.

In slimmer-based apps, as part of the insertion of the page into the static layout the entire HTML
tree is parsed, manipulated, and written out again. This writing process appears to inclue some
optimisations - the wrapping characters of these attributes are changed to single-quotes, allowing
unescaped double quotes in the final HTML.

The GovukPublishingComponents::Middleware::Ga4Optimise class replicates this effect for non-slimmer
apps.

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