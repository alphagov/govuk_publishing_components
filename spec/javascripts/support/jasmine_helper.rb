require "jasmine_selenium_runner/configure_jasmine"

include Sprockets::Rails::Helper

class ChromeHeadlessJasmineConfigurer < JasmineSeleniumRunner::ConfigureJasmine
  def selenium_options
    { options: GovukTest.headless_chrome_selenium_options }
  end
end
