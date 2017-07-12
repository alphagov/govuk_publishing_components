module GovukPublishingComponents
  def self.configure
    yield(Config)
  end

  module Config
    # Name of your component guide
    mattr_accessor :component_guide_title
    @@component_guide_title = "GOV.UK Component Guide"
  end
end
