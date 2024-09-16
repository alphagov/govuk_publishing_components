/* eslint-env jasmine, jquery */
/* global GOVUK */

describe('GOVUK.analyticsGa4.PIIRemover', function () {
  var pii

  beforeEach(function () {
    pii = new GOVUK.analyticsGa4.PIIRemover()
  })

  afterEach(function () {
    resetHead()
  })

  describe('by default', function () {
    it('strips email addresses, but not postcodes and dates from strings', function () {
      var string = pii.stripPII('this is an@email.com address, this is a sw1a 1aa postcode, this is a 2019-01-21 date, and this is another 1 January 1990 date')
      expect(string).toEqual('this is [email] address, this is a sw1a 1aa postcode, this is a 2019-01-21 date, and this is another 1 January 1990 date')
    })

    it('strips email addresses but not dates and postcodes from objects', function () {
      var obj = {
        email: 'this is an@email.com address',
        postcode: 'this is a sw1a 1aa postcode',
        date: 'this is a 2019-01-21 date',
        date2: 'this is another 1 January 1990 date'
      }

      var strippedObj = {
        email: 'this is [email] address',
        postcode: 'this is a sw1a 1aa postcode',
        date: 'this is a 2019-01-21 date',
        date2: 'this is another 1 January 1990 date'
      }

      obj = pii.stripPII(obj)
      expect(obj).toEqual(strippedObj)
    })

    it('strips email addresses but not dates and postcodes from arrays', function () {
      var arr = [
        'this is an@email.com address',
        'this is a sw1a 1aa postcode',
        'this is a 2019-01-21 date',
        'this is another 1 January 1990 date'
      ]

      var strippedArr = [
        'this is [email] address',
        'this is a sw1a 1aa postcode',
        'this is a 2019-01-21 date',
        'this is another 1 January 1990 date'
      ]

      arr = pii.stripPII(arr)
      expect(arr).toEqual(strippedArr)
    })
  })

  describe('by default for account specific PII', function () {
    it('redacts the expected list of URL parameters', function () {
      var resetPasswordToken = pii.stripPII('https://www.account.publishing.service.gov.uk/new-account?reset_password_token=4be6f4db-f32a-4d75-b0c7-3b3533ff31c4&somethingelse=24342fdjfskf')
      expect(resetPasswordToken).toEqual('https://www.account.publishing.service.gov.uk/new-account?reset_password_token=[reset_password_token]&somethingelse=24342fdjfskf')

      var unlockToken = pii.stripPII('https://www.account.publishing.service.gov.uk/new-account?unlock_token=4be6f4db-f32a-4d75-b0c7-3b3533ff31c4&somethingelse=24342fdjfskf')
      expect(unlockToken).toEqual('https://www.account.publishing.service.gov.uk/new-account?unlock_token=[unlock_token]&somethingelse=24342fdjfskf')

      var state = pii.stripPII('https://www.account.publishing.service.gov.uk/new-account?state=4be6f4db-f32a-4d75-b0c7-3b3533ff31c4&somethingelse=24342fdjfskf')
      expect(state).toEqual('https://www.account.publishing.service.gov.uk/new-account?state=[state]&somethingelse=24342fdjfskf')
    })
  })

  describe('when configured to remove all PII', function () {
    beforeEach(function () {
      pageWantsDatesStripped()
      pageWantsPostcodesStripped()
      pii = new GOVUK.analyticsGa4.PIIRemover()
    })

    it('strips email addresses, postcodes and dates from strings', function () {
      var string = pii.stripPII('this is an@email.com address, this is a sw1a 1aa postcode, this is a 2019-01-21 date, and this is another 1 January 1990 date')
      expect(string).toEqual('this is [email] address, this is a [postcode] postcode, this is a [date] date, and this is another [date] date')
    })

    it('strips all PII from objects', function () {
      var obj = {
        email: 'this is an@email.com address',
        postcode: 'this is a sw1a 1aa postcode',
        date: 'this is a 2019-01-21 date',
        date2: 'this is another 1 January 1990 date',
        uuid: 'd6c2de5d-ef90-45d1-82d4-5f2438369eea'
      }

      var strippedObj = {
        email: 'this is [email] address',
        postcode: 'this is a [postcode] postcode',
        date: 'this is a [date] date',
        date2: 'this is another [date] date',
        uuid: 'd6c2de5d-ef90-45d1-82d4-5f2438369eea'
      }

      obj = pii.stripPII(obj)
      expect(obj).toEqual(strippedObj)
    })

    it('strips all PII from arrays', function () {
      var arr = [
        'this is an@email.com address',
        'this is a sw1a 1aa postcode',
        'this is a 2019-01-21 date',
        'and this is another 1 January 1990 date'
      ]

      var strippedArr = [
        'this is [email] address',
        'this is a [postcode] postcode',
        'this is a [date] date',
        'and this is another [date] date'
      ]

      arr = pii.stripPII(arr)
      expect(arr).toEqual(strippedArr)
    })
  })

  describe('when there is a govuk:ga4-strip-postcodes meta tag present', function () {
    beforeEach(function () {
      pageWantsPostcodesStripped()
      pii = new GOVUK.analyticsGa4.PIIRemover()
    })

    it('observes the meta tag and strips out postcodes', function () {
      expect(pii.stripPostcodePII).toEqual(true)
      var string = pii.stripPII('this is an@email.com address, this is a sw1a 1aa postcode, this is a long GL194LYX postcode, this is a 2019-01-21 date, this is another 1 January 1990 date, this is a d6c2de5d-ef90-45d1-82d4-5f2438369eea content ID, this is a p800refund')
      expect(string).toEqual('this is [email] address, this is a [postcode] postcode, this is a long [postcode] postcode, this is a 2019-01-21 date, this is another 1 January 1990 date, this is a d6c2de5d-ef90-45d1-82d4-5f2438369eea content ID, this is a p800refund')
    })

    it('doesn\'t strip out UUIDs in URLs', function () {
      expect(pii.stripPostcodePII).toEqual(true)
      var string = pii.stripPII('gov.uk/thing?postcode=sw1a1aa&uuid=d6c2de5d-ef90-45d1-82d4-5f2438369eea')
      expect(string).toEqual('gov.uk/thing?postcode=[postcode]&uuid=d6c2de5d-ef90-45d1-82d4-5f2438369eea')
    })
  })

  describe('when there is a govuk:ga4-strip-query-string-parameters meta tag present', function () {
    it('strips specified query strings that are identified in a string', function () {
      pageWantsQueryStringParametersStripped(['strip-parameter-1', 'strip-parameter-2'])
      pii = new GOVUK.analyticsGa4.PIIRemover()
      var string = pii.stripPII('this is a string with a url /test?strip-parameter-1=secret&strip-parameter-2=more-secret')
      expect(string).toEqual('this is a string with a url /test?strip-parameter-1=[strip-parameter-1]&strip-parameter-2=[strip-parameter-2]')
    })

    it('can strip query strings with special characters', function () {
      pageWantsQueryStringParametersStripped(['parameter[]'])
      pii = new GOVUK.analyticsGa4.PIIRemover()
      var string = pii.stripPII('/url?parameter[]=secret&parameter[]=more-secret')
      expect(string).toEqual('/url?parameter[]=[parameter[]]&parameter[]=[parameter[]]')
    })

    it('matches a URL with a fragment', function () {
      pageWantsQueryStringParametersStripped(['parameter'])
      pii = new GOVUK.analyticsGa4.PIIRemover()
      var string = pii.stripPII('/url?parameter=secret#anchor')
      expect(string).toEqual('/url?parameter=[parameter]#anchor')
    })

    it('doesn\'t match params without a query string prefix', function () {
      pageWantsQueryStringParametersStripped(['parameter'])
      pii = new GOVUK.analyticsGa4.PIIRemover()
      var string = pii.stripPII('parameter=secret')
      expect(string).toEqual('parameter=secret')
    })
  })

  describe('when there is a govuk:ga4-strip-dates meta tag present', function () {
    beforeEach(function () {
      pageWantsDatesStripped()
      pii = new GOVUK.analyticsGa4.PIIRemover()
    })

    it('observes the meta tag and strips out dates', function () {
      expect(pii.stripDatePII).toEqual(true)
      var string = pii.stripPII('this is an@email.com address, this is a sw1a 1aa postcode, this is a 2019-01-21 date, and this is another 1 January 1990 date')
      expect(string).toEqual('this is [email] address, this is a sw1a 1aa postcode, this is a [date] date, and this is another [date] date')
    })
  })

  describe('when the override to strip dates and postcodes is present', function () {
    beforeEach(function () {
      pageWantsDatesStripped()
      pageWantsPostcodesStripped()
      pii = new GOVUK.analyticsGa4.PIIRemover()
    })

    it('observes the override and strips out emails', function () {
      var string = pii.stripPIIWithOverride('this is an@email.com address, this is a sw1a 1aa postcode, this is a 2019-01-21 date and this is another 1 January 1990 date', false, false)
      expect(string).toEqual('this is [email] address, this is a sw1a 1aa postcode, this is a 2019-01-21 date and this is another 1 January 1990 date')
    })

    it('observes the override and strips out emails and dates', function () {
      var string = pii.stripPIIWithOverride('this is an@email.com address, this is a sw1a 1aa postcode, this is a 2019-01-21 date and this is another 1 January 1990 date', true, false)
      expect(string).toEqual('this is [email] address, this is a sw1a 1aa postcode, this is a [date] date and this is another [date] date')
    })

    it('observes the override and strips out emails and postcodes', function () {
      var string = pii.stripPIIWithOverride('this is an@email.com address, this is a sw1a 1aa postcode, this is a 2019-01-21 date and this is another 1 January 1990 date', false, true)
      expect(string).toEqual('this is [email] address, this is a [postcode] postcode, this is a 2019-01-21 date and this is another 1 January 1990 date')
    })

    it('observes the override and strips out emails, postcodes and dates', function () {
      var string = pii.stripPIIWithOverride('this is an@email.com address, this is a sw1a 1aa postcode, this is a 2019-01-21 date and this is another 1 January 1990 date', true, true)
      expect(string).toEqual('this is [email] address, this is a [postcode] postcode, this is a [date] date and this is another [date] date')
    })
  })

  it('ensures the email address regex does not include the + character', function () {
    var string = pii.stripPIIWithOverride('hello+world+email@example.com+SW12AA+1990-01-01', false, false)
    expect(string).toEqual('hello+world+[email]+SW12AA+1990-01-01')
  })

  it('can strip a wide range of dates', function () {
    var dates = [
      '01/01/1990', '01-01-1990', '1-1-1990', '1/1/1990', '01\\01\\1990', '1\\1\\1990',
      '1990/01/01', '1990-01-01', '1990-1-1', '1990/1/1', '1990\\1\\1', '1990\\01\\01',
      '19900101'
    ]

    // Use a for loop to create all the possible string date combinations
    var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December',
      'Jan', 'Feb', 'Mar', 'Apr', 'Jun', 'Jul', 'Aug', 'Sep', 'Sept', 'Oct', 'Nov', 'Dec']

    for (var i = 0; i < months.length; i++) {
      var month = months[i]
      var monthVariations = [month, month.toLowerCase(), month.toUpperCase()] // Test multiple character case types e.g. 'January', 'JANUARY, 'january'

      for (var j = 0; j < monthVariations; j++) {
        var monthVariation = monthVariations[j]
        dates.push('1st of ' + monthVariation + ' 1990')
        dates.push('1st ' + monthVariation + ' 1990')
        dates.push('1 ' + monthVariation + ' 1990')
        dates.push('1 of ' + monthVariation + ' 1990')
        dates.push('2nd of ' + monthVariation + ' 1990')
        dates.push('2nd ' + monthVariation + ' 1990')
        dates.push('3rd of ' + monthVariation + ' 1990')
        dates.push('3rd ' + monthVariation + ' 1990')
        dates.push('4th of ' + monthVariation + ' 1990')
        dates.push('4th ' + monthVariation + ' 1990')
        dates.push('10th of ' + monthVariation + ' 1990')
        dates.push('10th ' + monthVariation + ' 1990')
        dates.push('10 of ' + monthVariation + ' 1990')
        dates.push('25th of ' + monthVariation + ' 90')
        dates.push('25th of ' + monthVariation + " '90")

        dates.push(monthVariation + ' 1st 1990')
        dates.push(monthVariation + ' 2nd 1990')
        dates.push(monthVariation + ' 3rd 1990')
        dates.push(monthVariation + ' 4th 1990')
        dates.push(monthVariation + ' 10th 1990')
        dates.push(monthVariation + ' 1 1990')
        dates.push(monthVariation + ' 10 1990')
        dates.push(monthVariation + ' 10 90')
        dates.push(monthVariation + " 10 '90")
      }
    }

    for (i = 0; i < dates.length; i++) {
      var date = dates[i]
      var string = pii.stripPIIWithOverride(date, true, true)
      expect(string).toEqual('[date]')
    }
  })

  function resetHead () {
    $('head').find('meta[name="govuk:ga4-strip-postcodes"]').remove()
    $('head').find('meta[name="govuk:ga4-strip-dates"]').remove()
    $('head').find('meta[name="govuk:ga4-strip-query-string-parameters"]').remove()
  }

  function pageWantsDatesStripped () {
    $('head').append('<meta name="govuk:ga4-strip-dates" value="does not matter" />')
  }

  function pageWantsPostcodesStripped () {
    $('head').append('<meta name="govuk:ga4-strip-postcodes" value="does not matter" />')
  }

  function pageWantsQueryStringParametersStripped (parameters) {
    $('head').append('<meta name="govuk:ga4-strip-query-string-parameters" content="' + parameters.join(', ') + '" />')
  }
})
