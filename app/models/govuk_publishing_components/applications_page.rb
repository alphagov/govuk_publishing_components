module GovukPublishingComponents
  class ApplicationsPage
    attr_reader :source, :ruby_version

    def initialize(application)
      @application = application
      @dir = get_directory
      @gemfilelock = get_file("Gemfile.lock")
      rubyfile = get_file(".ruby-version")
      @ruby_version = rubyfile.strip if rubyfile
      @packagejson = get_file("package.json")
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

    def ruby_status(version)
      version = version.to_f # to_f ignores non-numbers on the string end, so 3.3.1 becomes 3.1
      versions = [
        {
          version: 3.3,
          eol: "2027-03-31",
        },
        {
          version: 3.2,
          eol: "2026-03-31",
        },
        {
          version: 3.1,
          eol: "2024-04-23",
        },
      ]
      today = Date.today # rubocop:disable Rails/Date
      result = "not set"

      versions.each do |v|
        next unless version >= v[:version]

        version_eol = Date.parse(v[:eol])
        age = version_eol - today
        result = "green"
        result = "orange" if age < 100
        result = "red" if age.negative?
        break
      end

      result
    end

    def yarn_version
      parse_file(@packagejson, /"packageManager"\s*:\s*"yarn@(\d+(?:\.\d+)*)"/)
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
