/* eslint-env jasmine */

describe('Google Analytics schemas', function () {
  var schemas

  beforeAll(function () {
    window.GOVUK.analyticsGa4 = window.GOVUK.analyticsGa4 || {}
    window.GOVUK.analyticsGa4.vars = window.GOVUK.analyticsGa4.vars || {}
    window.GOVUK.analyticsGa4.vars.gem_version = 'aVersion'
  })

  beforeEach(function () {
    schemas = new window.GOVUK.analyticsGa4.Schemas()
  })

  it('only allows data from the schema', function () {
    var data = {
      event_name: 'test_event_name',
      type: 'test_type',
      not_valid: 'test_not_valid'
    }
    var expected = {
      event: 'example',
      event_data: {
        event_name: 'test_event_name',
        type: 'test_type',
        url: undefined,
        text: undefined,
        index: undefined,
        index_total: undefined,
        section: undefined,
        action: undefined,
        external: undefined,
        method: undefined,
        link_domain: undefined,
        link_path_parts: undefined,
        tool_name: undefined,
        percent_scrolled: undefined
      }
    }
    var returned = schemas.mergeProperties(data, 'example')
    expect(returned).toEqual(expected)
  })

  it('handles nested input correctly', function () {
    var data = {
      event_name: 'test_event_name',
      index: {
        index_section: '1'
      }
    }
    var expected = {
      event: 'example',
      event_data: {
        event_name: 'test_event_name',
        type: undefined,
        url: undefined,
        text: undefined,
        index: {
          index_section: '1'
        },
        index_total: undefined,
        section: undefined,
        action: undefined,
        external: undefined,
        method: undefined,
        link_domain: undefined,
        link_path_parts: undefined,
        tool_name: undefined,
        percent_scrolled: undefined
      }
    }
    var returned = schemas.mergeProperties(data, 'example')
    expect(returned).toEqual(expected)
  })
})
