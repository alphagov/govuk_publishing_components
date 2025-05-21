require "govuk_publishing_components/middleware/ga4_optimise"

describe GovukPublishingComponents::Middleware::Ga4Optimise do
  subject(:ga4_optimise_middleware) { described_class.new(app) }

  let(:env) { Rack::MockRequest.env_for }
  let(:app) { ->(_env) { ActionDispatch::Response.create(200, { "content-type" => content_type }, html).to_a } }
  let(:content_type) { "text/html" }

  context "when the html contains an unoptimised data-ga4- attribute" do
    let(:html) { '<a data-ga4-link="my &quot;attribute&quot;">' }

    it "replaces the escaped quotes in a data-ga4- attribute with unescaped ones" do
      expected = "<a data-ga4-link='my \"attribute\"'>"
      (_, _, body) = ga4_optimise_middleware.call(env)

      expect(body.first).to eq(expected)
    end
  end

  context "when the html contains an optimised data-ga4- attribute" do
    let(:html) { "<a data-ga4-link='my \"attribute\"'>" }

    it "makes no changes" do
      expected = html.dup
      (_, _, body) = ga4_optimise_middleware.call(env)

      expect(body.first).to eq(expected)
    end
  end

  context "when the html contains an unoptimised non-data-ga4- attribute" do
    let(:html) { '<a data-attribute="my &quot;attribute&quot;">' }

    it "leaves the input alone" do
      expected = html.dup
      (_, _, body) = ga4_optimise_middleware.call(env)

      expect(body.first).to eq(expected)
    end
  end

  context "when the content contains an unoptimised data-ga4 attribute but isn't html" do
    let(:content_type) { "text/plain" }
    let(:html) { 'data-ga4-form="my &quot;attribute&quot;"' }

    it "leaves the input alone" do
      expected = html.dup
      (_, _, body) = ga4_optimise_middleware.call(env)

      expect(body.first).to eq(expected)
    end
  end

  context "when the content contains an unoptimised data-ga4 attribute but content-type is nil" do
    let(:null_response) do
      response = ActionDispatch::Response.create(200, {}, html)
      response.to_a # triggers response to auto-create the content-type header
      response.headers.delete("content-type")
      response
    end

    let(:app) { ->(_env) { null_response.to_a } }
    let(:html) { 'data-ga4-form="my &quot;attribute&quot;"' }

    it "leaves the input alone" do
      expected = html.dup
      (_, _, body) = ga4_optimise_middleware.call(env)

      expect(body.first).to eq(expected)
    end
  end

  context "when the response is a generic rack response rather than an ActionDispatch::Response" do
    let(:app) { ->(_env) { [200, {}, [html]] } }
    let(:html) { 'data-ga4-form="my &quot;attribute&quot;"' }

    it "leaves the input alone" do
      expected = html.dup
      (_, _, body) = ga4_optimise_middleware.call(env)

      expect(body.first).to eq(expected)
    end
  end
end
