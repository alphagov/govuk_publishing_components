require "gds_api/content_store"
require "gds_api/validators/base_path_validator"

module Services
  def self.content_store
    @content_store ||= GdsApi::ContentStore.new(
      Plek.new.find("content-store"),
      disable_cache: true,
    )
  end
end
