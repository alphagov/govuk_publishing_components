module GovukPublishingComponents
  class ApplicationsPage
    attr_reader :source

    def initialize(application)
      @application = application
      @dir = get_directory
      @gemfilelock = get_gemfile
    end

    def readable_name
      @application.gsub("-", " ").capitalize
    end

    def gem_version
      parse_file(@gemfilelock, /govuk_publishing_components \(([^)>=~ ]+)\)/)
    end

    def slimmer_version
      parse_file(@gemfilelock, /slimmer \(([^)>=~ ]+)\)/)
    end

    def sass_version
      parse_file(@gemfilelock, /sass-embedded \(([^)>=~ ]+)\)/)
    end

  private

    def get_directory
      app_dir = "#{File.expand_path('..')}/#{@application}"
      Dir.exist?(app_dir) ? app_dir : false
    end

    def get_gemfile
      @dir ? get_gemfile_local : get_gemfile_remote
    end

    def get_gemfile_local
      lockfile = "#{@dir}/Gemfile.lock"
      return unless File.file?(lockfile)

      @source = "local"
      File.read(lockfile)
    end

    def get_gemfile_remote
      uri = URI("https://raw.githubusercontent.com/alphagov/#{@application}/main/Gemfile.lock")
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
