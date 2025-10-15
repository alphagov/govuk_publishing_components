module GovukPublishingComponents
  class ApplicationsPage
    def initialize(application)
      @application = application
      @dir = get_directory
      @local = true if @dir
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

    def found
      @gemfilelock != nil
    end

  private

    def get_gemfile
      @local ? get_gemfile_local : get_gemfile_remote
    end

    def get_gemfile_local
      lockfile = "#{@dir}/Gemfile.lockkkk"
      return unless File.file?(lockfile)

      File.read(lockfile)
    end

    def get_gemfile_remote
      url = "https://raw.githubusercontent.com/alphagov/#{@application}/main/Gemfile.lockkkk"
      Net::HTTP.get(URI.parse(url))
    rescue StandardError => e
      puts "Error fetching remote for #{@application}"
      return nil
    end

    def parse_file(src, regex)
      return unless src

      matches = src.match(regex)
      matches[1] if matches
    end

    def get_directory
      host_dir = File.expand_path("..")
      app_dir = "#{host_dir}/#{@application}"
      @directory = app_dir if Dir.exist?(app_dir)
    end
  end
end
