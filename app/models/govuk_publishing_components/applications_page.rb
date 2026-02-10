module GovukPublishingComponents
  class ApplicationsPage
    attr_reader :source

    def initialize(application)
      @application = application
      @dir = get_directory
      @gemfilelock = get_file("Gemfile.lock")
    end

    def readable_name
      @application.gsub("-", " ").capitalize
    end

    def gem_version
      parse_file(@gemfilelock, /govuk_publishing_components \(([^)>=~ ]+)\)/)
    end

    def sass_version
      parse_file(@gemfilelock, /sass-embedded \(([^)>=~ ]+)\)/)
    end

  private

    def get_directory
      app_dir = "#{File.expand_path('..')}/#{@application}"
      Dir.exist?(app_dir) ? app_dir : false
    end

    def get_file(name)
      @dir ? get_local_file(name) : get_remote_file(name)
    end

    def get_local_file(name)
      lockfile = "#{@dir}/#{name}"
      return unless File.file?(lockfile)

      @source = "local"
      File.read(lockfile)
    end

    def get_remote_file(name)
      uri = URI("https://raw.githubusercontent.com/alphagov/#{@application}/main/#{name}")
      result = Net::HTTP.get_response(uri)
      if result.is_a?(Net::HTTPSuccess)
        @source = "remote"
        result.body
      end
    rescue StandardError
      @source = nil
    end

    def parse_file(src, regex)
      return unless src

      matches = src.match(regex)
      matches[1] if matches
    end
  end
end
