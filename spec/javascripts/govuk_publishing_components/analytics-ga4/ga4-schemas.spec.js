/* eslint-env jasmine */

describe('Google Analytics schemas', function () {
  var schemas

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
        text_2: this.undefined,
        text_3: this.undefined,
        text_4: this.undefined,
        text_5: this.undefined,
        index: {
          index_link: undefined,
          index_section: undefined,
          index_section_count: undefined
        },
        index_total: undefined,
        section: undefined,
        action: undefined,
        external: undefined,
        method: undefined,
        link_domain: undefined,
        tool_name: undefined,
        percent_scrolled: undefined,
        video_current_time: undefined,
        length: undefined,
        video_percent: undefined,
        autocomplete_input: undefined,
        autocomplete_suggestions: undefined,
        content_id: this.undefined,
        user_id: this.undefined
      }
    }
    var returned = schemas.mergeProperties(data, 'example')
    expect(returned).toEqual(expected)
  })

  it('inserts data into the right place in the schema', function () {
    var data = {
      event_name: 'test_event_name',
      index_section: '1',
      index_link: '3'
    }
    var expected = {
      event: 'example',
      event_data: {
        event_name: 'test_event_name',
        type: undefined,
        url: undefined,
        text: undefined,
        text_2: this.undefined,
        text_3: this.undefined,
        text_4: this.undefined,
        text_5: this.undefined,
        index: {
          index_link: '3',
          index_section: '1',
          index_section_count: undefined
        },
        index_total: undefined,
        section: undefined,
        action: undefined,
        external: undefined,
        method: undefined,
        link_domain: undefined,
        tool_name: undefined,
        percent_scrolled: undefined,
        video_current_time: undefined,
        length: undefined,
        video_percent: undefined,
        autocomplete_input: undefined,
        autocomplete_suggestions: undefined,
        content_id: this.undefined,
        user_id: this.undefined
      }
    }
    var returned = schemas.mergeProperties(data, 'example')
    expect(returned).toEqual(expected)
  })

  it('does not overwrite the schema if an undefined value is passed', function () {
    var data = {
      event_name: 'test_event_name',
      index_link: 1,
      index: undefined
    }
    var expected = {
      event: 'example',
      event_data: {
        event_name: 'test_event_name',
        type: undefined,
        url: undefined,
        text: undefined,
        text_2: this.undefined,
        text_3: this.undefined,
        text_4: this.undefined,
        text_5: this.undefined,
        index: {
          index_link: '1',
          index_section: undefined,
          index_section_count: undefined
        },
        index_total: undefined,
        section: undefined,
        action: undefined,
        external: undefined,
        method: undefined,
        link_domain: undefined,
        tool_name: undefined,
        percent_scrolled: undefined,
        video_current_time: undefined,
        length: undefined,
        video_percent: undefined,
        autocomplete_input: undefined,
        autocomplete_suggestions: undefined,
        content_id: this.undefined,
        user_id: this.undefined
      }
    }
    var returned = schemas.mergeProperties(data, 'example')
    expect(returned).toEqual(expected)
  })

  it('ensures that all attribute values are strings', function () {
    var data = {
      event_name: 4,
      index_link: 1,
      section: '3',
      action: '5_string'
    }
    var expected = {
      event: 'example',
      event_data: {
        event_name: '4',
        type: undefined,
        url: undefined,
        text: undefined,
        text_2: this.undefined,
        text_3: this.undefined,
        text_4: this.undefined,
        text_5: this.undefined,
        index: {
          index_link: '1',
          index_section: undefined,
          index_section_count: undefined
        },
        index_total: undefined,
        section: '3',
        action: '5_string',
        external: undefined,
        method: undefined,
        link_domain: undefined,
        tool_name: undefined,
        percent_scrolled: undefined,
        video_current_time: undefined,
        length: undefined,
        video_percent: undefined,
        autocomplete_input: undefined,
        autocomplete_suggestions: undefined,
        content_id: this.undefined,
        user_id: this.undefined
      }
    }
    var returned = schemas.mergeProperties(data, 'example')
    expect(returned).toEqual(expected)
  })

  describe('finding and replacing values in an object', function () {
    it('correctly identifies an object', function () {
      expect(schemas.isAnObject({})).toEqual(true)

      expect(schemas.isAnObject('')).not.toEqual(true)
      expect(schemas.isAnObject([])).not.toEqual(true)
      expect(schemas.isAnObject(2)).not.toEqual(true)
      expect(schemas.isAnObject(null)).not.toEqual(true)
      expect(schemas.isAnObject(undefined)).not.toEqual(true)
    })

    it('handles unnested objects', function () {
      var obj = {
        key1: 'value1',
        key2: 'value2'
      }
      var expected = {
        key1: 'value1',
        key2: 'moose'
      }
      expect(schemas.addToObject(obj, 'key2', 'moose')).toEqual(expected)
    })

    it('handles nested objects', function () {
      var obj = {
        key1: 'value1',
        key2: 'value2',
        key3: {
          key4: 'value4',
          key5: 'value5'
        }
      }
      var expected = {
        key1: 'value1',
        key2: 'value2',
        key3: {
          key4: 'value4',
          key5: 'moose'
        }
      }
      expect(schemas.addToObject(obj, 'key5', 'moose')).toEqual(expected)
    })
  })
})
