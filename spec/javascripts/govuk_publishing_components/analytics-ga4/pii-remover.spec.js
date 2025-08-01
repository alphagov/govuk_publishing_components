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

    it('strips visa application numbers', function () {
      var string = pii.stripPII('my visa application numbers are GWF123456789 and GB123456789000')
      expect(string).toEqual('my visa application numbers are [gwf number] and [gb eori number]')
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

  describe('national insurance numbers', function () {
    it('are stripped if they are valid NI numbers', function () {
      // Generate 50 random NI numbers so we aren't storing any actual ones in the code.
      for (var i = 0; i < 50; i++) {
        var testNumber = generateNINumber(true, false)
        var testNumberWithSpaces = generateNINumber(true, true)

        var redacted1 = pii.stripPIIWithOverride(testNumber, false, false)
        var redacted2 = pii.stripPIIWithOverride(testNumberWithSpaces, false, false)
        expect(redacted1).toEqual('[ni number]')
        expect(redacted2).toEqual('[ni number]')
      }
    })

    it('are not stripped if they are invalid NI numbers', function () {
      // Generate 50 random NI numbers so we aren't storing any actual ones in the code.
      for (var i = 0; i < 50; i++) {
        var testNumber = generateNINumber(false, false)
        var testNumberWithSpaces = generateNINumber(false, true)
        var redacted1 = pii.stripPIIWithOverride(testNumber, false, false)
        var redacted2 = pii.stripPIIWithOverride(testNumberWithSpaces, false, false)
        expect(redacted1).toEqual(testNumber)
        expect(redacted2).toEqual(testNumberWithSpaces)
      }
    })

    it('are stripped even if they are surrounded by other text', function () {
      // Generate 50 random NI numbers so we aren't storing any actual ones in the code.
      for (var i = 0; i < 50; i++) {
        var testNumber = '?query_string=' + generateNINumber(true, false) + '&other_value=hello'
        var redacted = pii.stripPIIWithOverride(testNumber, false, false)
        expect(redacted).toEqual('?query_string=[ni number]&other_value=hello')
      }
    })

    it('are stripped even in lowercase', function () {
      // Generate 50 random NI numbers so we aren't storing any actual ones in the code.
      for (var i = 0; i < 50; i++) {
        var testNumber = generateNINumber(true, false).toLowerCase()
        var redacted = pii.stripPIIWithOverride(testNumber, false, false)
        expect(redacted).toEqual('[ni number]')
      }
    })
  })

  const spaceIndexes = {
    UK_MOBILE: [5],
    UK_MOBILE_INTERNATIONAL: [7],
    UK_LANDLINE_1: [3, 6],
    UK_LANDLINE_2: [3, 7],
    UK_LANDLINE_3: [5],
    UK_LANDLINE_INTERNATIONAL_1: [5, 9],
    UK_LANDLINE_INTERNATIONAL_2: [5, 8],
    UK_LANDLINE_INTERNATIONAL_3: [7]
  }

  function generatePhoneNumber (prefix, amount, suffix = '', spaceData = []) {
    var phoneNumber = prefix
    for (var i = 0; i < amount; i++) {
      // If current string index position is listed in the 'spaceData' array, insert a space into the string.
      if (spaceData.indexOf(prefix.length + i) !== -1) {
        phoneNumber += ' '
      }

      phoneNumber += Math.floor(Math.random() * 10)
    }
    return `${phoneNumber}${suffix}`
  }

  describe('phone numbers', function () {
    it('are stripped if they are valid UK mobile numbers', function () {
      // Test 50 random phone numbers so we aren't storing any numbers in code.
      for (let i = 0; i < 50; i++) {
        const phoneNumber = generatePhoneNumber('07', 9)
        const redactedNumber = pii.stripPIIWithOverride(phoneNumber)
        expect(redactedNumber).toEqual('[phone number]')
      }
    })

    it('are stripped if they are valid UK mobile numbers with spacing', function () {
      // Test 50 random phone numbers so we aren't storing any numbers in code.
      for (let i = 0; i < 50; i++) {
        const phoneNumber = generatePhoneNumber('07', 9, '', spaceIndexes.UK_MOBILE)
        const redactedNumber = pii.stripPIIWithOverride(phoneNumber)
        expect(redactedNumber).toEqual('[phone number]')
      }
    })

    it('are stripped if they are valid international UK mobile numbers', function () {
      // Test 50 random phone numbers so we aren't storing any numbers in code.
      for (let i = 0; i < 50; i++) {
        const phoneNumber = generatePhoneNumber('+447', 9)
        const redactedNumber = pii.stripPIIWithOverride(phoneNumber)
        expect(redactedNumber).toEqual('[phone number]')
      }

      // Without + prefix
      for (let i = 0; i < 50; i++) {
        const phoneNumber = generatePhoneNumber('447', 9)
        const redactedNumber = pii.stripPIIWithOverride(phoneNumber)
        expect(redactedNumber).toEqual('[phone number]')
      }
    })

    it('are stripped if they are valid international UK mobile numbers with spacing', function () {
      // Test 50 random phone numbers so we aren't storing any numbers in code.
      for (let i = 0; i < 50; i++) {
        const phoneNumber = generatePhoneNumber('+447', 9, '', spaceIndexes.UK_MOBILE_INTERNATIONAL)
        const redactedNumber = pii.stripPIIWithOverride(phoneNumber)
        expect(redactedNumber).toEqual('[phone number]')
      }

      // Without + prefix
      for (let i = 0; i < 50; i++) {
        const phoneNumber = generatePhoneNumber('+447', 9, '', spaceIndexes.UK_MOBILE_INTERNATIONAL).replace('+', '')
        const redactedNumber = pii.stripPIIWithOverride(phoneNumber)
        expect(redactedNumber).toEqual('[phone number]')
      }
    })

    it('are stripped if they are valid UK landline numbers', function () {
      // Test 50 random phone numbers so we aren't storing any numbers in code.
      for (let i = 0; i < 50; i++) {
        // A landline can start with 01, 02, 04, or 06, so we generate all 4 examples here.
        const numbers = [
          generatePhoneNumber('01', 9),
          generatePhoneNumber('02', 9),
          generatePhoneNumber('04', 9),
          generatePhoneNumber('06', 9),
          generatePhoneNumber('01', 8),
          generatePhoneNumber('02', 8),
          generatePhoneNumber('04', 8),
          generatePhoneNumber('06', 8)]
        for (const number of numbers) {
          const redactedNumber = pii.stripPIIWithOverride(number)
          expect(redactedNumber).toEqual('[phone number]')
        }
      }
    })

    it('are stripped if they are valid UK landline numbers with spacing', function () {
      // Test 50 random phone numbers so we aren't storing any numbers in code.
      for (let i = 0; i < 50; i++) {
        // A landline can start with 01, 02, 04, or 06, so we generate all 4 examples here.
        const numbers = [
          generatePhoneNumber('01', 9, '', spaceIndexes.UK_LANDLINE_2),
          generatePhoneNumber('02', 9, '', spaceIndexes.UK_LANDLINE_2),
          generatePhoneNumber('04', 9, '', spaceIndexes.UK_LANDLINE_2),
          generatePhoneNumber('06', 9, '', spaceIndexes.UK_LANDLINE_2),
          generatePhoneNumber('01', 8, '', spaceIndexes.UK_LANDLINE_1),
          generatePhoneNumber('02', 8, '', spaceIndexes.UK_LANDLINE_1),
          generatePhoneNumber('04', 8, '', spaceIndexes.UK_LANDLINE_1),
          generatePhoneNumber('06', 8, '', spaceIndexes.UK_LANDLINE_1),
          generatePhoneNumber('01', 9, '', spaceIndexes.UK_LANDLINE_3),
          generatePhoneNumber('02', 9, '', spaceIndexes.UK_LANDLINE_3),
          generatePhoneNumber('04', 9, '', spaceIndexes.UK_LANDLINE_3),
          generatePhoneNumber('06', 9, '', spaceIndexes.UK_LANDLINE_3)]
        for (const number of numbers) {
          const redactedNumber = pii.stripPIIWithOverride(number)
          expect(redactedNumber).toEqual('[phone number]')
        }
      }
    })

    it('are stripped if they are valid international UK landline numbers', function () {
      // Test 50 random phone numbers so we aren't storing any numbers in code.
      for (let i = 0; i < 50; i++) {
        // A landline can start with 01, 02, 04, or 06, so we generate all 4 examples here.
        const numbers = [
          generatePhoneNumber('+441', 9),
          generatePhoneNumber('+442', 9),
          generatePhoneNumber('+444', 9),
          generatePhoneNumber('+446', 9),
          generatePhoneNumber('441', 9),
          generatePhoneNumber('+442', 9),
          generatePhoneNumber('444', 9),
          generatePhoneNumber('446', 9)
        ]
        for (const number of numbers) {
          const redactedNumber = pii.stripPIIWithOverride(number)
          expect(redactedNumber).toEqual('[phone number]')
        }
      }
    })

    it('are stripped if they are valid international UK landline numbers with spacing', function () {
      // Test 50 random phone numbers so we aren't storing any numbers in code.
      for (let i = 0; i < 50; i++) {
        // A landline can start with 01, 02, 04, or 06, so we generate all 4 examples here.
        const numbers = [
          generatePhoneNumber('+441', 9, '', spaceIndexes.UK_LANDLINE_INTERNATIONAL_1),
          generatePhoneNumber('+442', 9, '', spaceIndexes.UK_LANDLINE_INTERNATIONAL_1),
          generatePhoneNumber('+444', 9, '', spaceIndexes.UK_LANDLINE_INTERNATIONAL_1),
          generatePhoneNumber('+446', 9, '', spaceIndexes.UK_LANDLINE_INTERNATIONAL_1),
          generatePhoneNumber('+441', 8, '', spaceIndexes.UK_LANDLINE_INTERNATIONAL_2),
          generatePhoneNumber('+442', 8, '', spaceIndexes.UK_LANDLINE_INTERNATIONAL_2),
          generatePhoneNumber('+444', 8, '', spaceIndexes.UK_LANDLINE_INTERNATIONAL_2),
          generatePhoneNumber('+446', 8, '', spaceIndexes.UK_LANDLINE_INTERNATIONAL_2),
          generatePhoneNumber('+441', 9, '', spaceIndexes.UK_LANDLINE_INTERNATIONAL_3),
          generatePhoneNumber('+442', 9, '', spaceIndexes.UK_LANDLINE_INTERNATIONAL_3),
          generatePhoneNumber('+444', 9, '', spaceIndexes.UK_LANDLINE_INTERNATIONAL_3),
          generatePhoneNumber('+446', 9, '', spaceIndexes.UK_LANDLINE_INTERNATIONAL_3),
          generatePhoneNumber('+441', 9, '', spaceIndexes.UK_LANDLINE_INTERNATIONAL_1).replace('+', ''),
          generatePhoneNumber('+442', 9, '', spaceIndexes.UK_LANDLINE_INTERNATIONAL_1).replace('+', ''),
          generatePhoneNumber('+444', 9, '', spaceIndexes.UK_LANDLINE_INTERNATIONAL_1).replace('+', ''),
          generatePhoneNumber('+446', 9, '', spaceIndexes.UK_LANDLINE_INTERNATIONAL_1).replace('+', ''),
          generatePhoneNumber('+441', 8, '', spaceIndexes.UK_LANDLINE_INTERNATIONAL_2).replace('+', ''),
          generatePhoneNumber('+442', 8, '', spaceIndexes.UK_LANDLINE_INTERNATIONAL_2).replace('+', ''),
          generatePhoneNumber('+444', 8, '', spaceIndexes.UK_LANDLINE_INTERNATIONAL_2).replace('+', ''),
          generatePhoneNumber('+446', 8, '', spaceIndexes.UK_LANDLINE_INTERNATIONAL_2).replace('+', ''),
          generatePhoneNumber('+441', 9, '', spaceIndexes.UK_LANDLINE_INTERNATIONAL_3).replace('+', ''),
          generatePhoneNumber('+442', 9, '', spaceIndexes.UK_LANDLINE_INTERNATIONAL_3).replace('+', ''),
          generatePhoneNumber('+444', 9, '', spaceIndexes.UK_LANDLINE_INTERNATIONAL_3).replace('+', ''),
          generatePhoneNumber('+446', 9, '', spaceIndexes.UK_LANDLINE_INTERNATIONAL_3).replace('+', '')]

        for (const number of numbers) {
          const redactedNumber = pii.stripPIIWithOverride(number)
          expect(redactedNumber).toEqual('[phone number]')
        }
      }
    })

    it('are not stripped if they are invalid UK numbers', function () {
      // These are numbers that are too short to be valid, or start with the wrong number.
      const numbers = [
        generatePhoneNumber('07', 7),
        generatePhoneNumber('01', 7),
        generatePhoneNumber('02', 7),
        generatePhoneNumber('04', 7),
        generatePhoneNumber('06', 7),
        generatePhoneNumber('03', 9),
        generatePhoneNumber('05', 9),
        generatePhoneNumber('09', 9),
        generatePhoneNumber('+1', 9),
        generatePhoneNumber('17', 9),
        generatePhoneNumber('21', 9),
        generatePhoneNumber('32', 9),
        generatePhoneNumber('54', 9),
        generatePhoneNumber('56', 9),
        generatePhoneNumber('+1', 9)]

      for (const number of numbers) {
        const redactedNumber = pii.stripPIIWithOverride(number)
        expect(redactedNumber).toEqual(number)
      }
    })

    it('are stripped even if they are surrounded by other text', function () {
      const numbers = [
        generatePhoneNumber('hello+07', 9, '+world'),
        generatePhoneNumber('?01', 9, '!'),
        generatePhoneNumber('lorem02', 9, 'ipsum'),
        generatePhoneNumber('test04', 9, 'test'),
        generatePhoneNumber('test06', 9, '&test'),
        generatePhoneNumber('test+447', 9, 'test'),
        generatePhoneNumber('test+441', 9, 'test'),
        generatePhoneNumber('+442', 9, 'test'),
        generatePhoneNumber('+444', 9, 'test'),
        generatePhoneNumber('+446', 9, 'test'),
        generatePhoneNumber('+441', 8, 'test'),
        generatePhoneNumber('+442', 8, 'test'),
        generatePhoneNumber('+444', 8, 'test'),
        generatePhoneNumber('+446', 8, 'test')]

      for (const number of numbers) {
        const redactedNumber = pii.stripPIIWithOverride(number)
        expect(redactedNumber.includes('[phone number]')).toEqual(true)
      }
    })

    it('are stripped when special characters are used instead of a "+" prefix and/or different ways of representing whitespace', function () {
      const numbers = [
        '07123%20123456',
        '07123+123456',
        '+447123%20123456',
        '+447123%20123456',
        '+447123+123456',
        '%2B447123123456',
        '020+123+1234',
        '020+1234+1234',
        '020%20123%201234',
        '020%201234%201234',
        '02123+123456',
        '02123%20123456',
        '+4420+123+1234',
        '+4420%20123%201234',
        '%2B4420 123 1234',
        '+442123%20123456',
        '+442123+123456',
        '%2B442123+123456',
        '447123%20123456'
      ]

      for (const number of numbers) {
        const redactedNumber = pii.stripPIIWithOverride(number)
        expect(redactedNumber.includes('[phone number]')).toEqual(true)
      }
    })
  })

  function getRandomNumber (range) {
    return Math.floor(Math.random() * range)
  }

  function getRandomArrayValue (array) {
    return array[getRandomNumber(array.length)]
  }

  function generateNINumber (validNumber, withSpaces) {
    var firstLetters, lastLetters

    if (validNumber) {
      firstLetters = 'A B C E G H J K L M N O P R S T W X Y Z'.split(' ')
      lastLetters = 'A B C D'.split(' ')
    } else {
      firstLetters = 'D F I Q U V'.split(' ')
      lastLetters = 'E F G H I J K L M N O P Q R S T U V W X Y Z'.split(' ')
    }

    // Generate the first two random letters e.g. 'AB'
    var niNumber = getRandomArrayValue(firstLetters) + getRandomArrayValue(firstLetters)

    // Add optional space
    if (withSpaces) {
      niNumber += ' '
    }

    // Add 6 random digits between 0 and 9
    for (var j = 0; j < 6; j++) {
      niNumber += getRandomNumber(10)
      // Add optional space after the 2nd and 4th number
      if ((j === 1 || j === 3) && withSpaces) {
        niNumber += ' '
      }
    }

    // Add optional space
    if (withSpaces) {
      niNumber += ' '
    }

    // Add the final letter to the end of the string
    niNumber += getRandomArrayValue(lastLetters)
    return niNumber
  }

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
