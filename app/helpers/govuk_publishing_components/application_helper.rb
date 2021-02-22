module GovukPublishingComponents
  module ApplicationHelper
    def self.get_application_name_from_path(path)
      path.to_s.split("/")[-1]
    end
  end
end
