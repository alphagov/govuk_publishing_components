module GovukNavigationHelpers
  def self.configuration
    @configuration ||= Configuration.new
  end

  def self.configure
    yield configuration if block_given?
  end

  class Configuration
    attr_writer :error_handler, :statsd

    def error_handler
      @error_handler ||= NoErrorHandler.new
    end

    def statsd
      @statsd ||= NoStatsd.new
    end

    class NoStatsd
      def increment(*); end

      def time(*)
        yield
      end
    end

    class NoErrorHandler
      def notify(exception, *_args)
        puts exception
      end
    end
  end
end
