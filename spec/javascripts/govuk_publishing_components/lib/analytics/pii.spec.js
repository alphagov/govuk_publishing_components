describe("GOVUK.PII", function() {
  var pii

  beforeEach(function() {
    resetHead()
    pii = new GOVUK.pii()
  })

  afterEach(function() {
    resetHead()
  });

  describe('by default', function() {
    it("strips email addresses, but not postcodes and dates from strings", function() {
      var string = pii.stripPII("this is an@email.com address, this is a sw1a 1aa postcode, this is a 2019-01-21 date")
      expect(string).toEqual("this is [email] address, this is a sw1a 1aa postcode, this is a 2019-01-21 date")
    })

    it("strips email addresses but not dates and postcodes from objects", function() {
      var obj = {
        'email': 'this is an@email.com address',
        'postcode': 'this is a sw1a 1aa postcode',
        'date': 'this is a 2019-01-21 date'
      }

      var strippedObj = {
        'email': 'this is [email] address',
        'postcode': 'this is a sw1a 1aa postcode',
        'date': 'this is a 2019-01-21 date'
      }

      obj = pii.stripPII(obj)
      expect(obj).toEqual(strippedObj)
    })

    it("strips email addresses but not dates and postcodes from arrays", function() {
      var arr = [
        'this is an@email.com address',
        'this is a sw1a 1aa postcode',
        'this is a 2019-01-21 date'
      ]

      var strippedArr = [
        'this is [email] address',
        'this is a sw1a 1aa postcode',
        'this is a 2019-01-21 date'
      ]

      arr = pii.stripPII(arr)
      expect(arr).toEqual(strippedArr)
    })
  })

  describe('when configured to remove all PII', function() {
    beforeEach(function() {
      pageWantsDatesStripped()
      pageWantsPostcodesStripped()
      pii = new GOVUK.pii()
    })

    it("strips email addresses, postcodes and dates from strings", function() {
      var string = pii.stripPII("this is an@email.com address, this is a sw1a 1aa postcode, this is a 2019-01-21 date")
      expect(string).toEqual("this is [email] address, this is a [postcode] postcode, this is a [date] date")
    })

    it("strips all PII from objects", function() {
      var obj = {
        'email': 'this is an@email.com address',
        'postcode': 'this is a sw1a 1aa postcode',
        'date': 'this is a 2019-01-21 date'
      }

      var strippedObj = {
        'email': 'this is [email] address',
        'postcode': 'this is a [postcode] postcode',
        'date': 'this is a [date] date'
      }

      obj = pii.stripPII(obj)
      expect(obj).toEqual(strippedObj)
    })

    it("strips all PII from arrays", function() {
      var arr = [
        'this is an@email.com address',
        'this is a sw1a 1aa postcode',
        'this is a 2019-01-21 date'
      ]

      var strippedArr = [
        'this is [email] address',
        'this is a [postcode] postcode',
        'this is a [date] date'
      ]

      arr = pii.stripPII(arr)
      expect(arr).toEqual(strippedArr)
    })
  })

  describe('when there is a a govuk:static-analytics:strip-postcodes meta tag present', function() {
    beforeEach(function() {
      pageWantsPostcodesStripped()
      pii = new GOVUK.pii()
    });

    it('observes the meta tag and strips out postcodes', function() {
      expect(pii.stripPostcodePII).toEqual(true);
      var string = pii.stripPII("this is an@email.com address, this is a sw1a 1aa postcode, this is a 2019-01-21 date")
      expect(string).toEqual("this is [email] address, this is a [postcode] postcode, this is a 2019-01-21 date")
    });
  });

  describe('when there is a a govuk:static-analytics:strip-dates meta tag present', function() {
    beforeEach(function() {
      pageWantsDatesStripped()
      pii = new GOVUK.pii()
    });

    it('observes the meta tag and strips out postcodes', function() {
      expect(pii.stripDatePII).toEqual(true);
      var string = pii.stripPII("this is an@email.com address, this is a sw1a 1aa postcode, this is a 2019-01-21 date")
      expect(string).toEqual("this is [email] address, this is a sw1a 1aa postcode, this is a [date] date")
    });
  });

  function resetHead() {
    $('head').find('meta[name="govuk:static-analytics:strip-postcodes"]').remove();
    $('head').find('meta[name="govuk:static-analytics:strip-dates"]').remove();
  }

  function pageWantsDatesStripped() {
    $('head').append('<meta name="govuk:static-analytics:strip-dates" value="does not matter" />');
  }

  function pageWantsPostcodesStripped() {
    $('head').append('<meta name="govuk:static-analytics:strip-postcodes" value="does not matter" />');
  }
});
