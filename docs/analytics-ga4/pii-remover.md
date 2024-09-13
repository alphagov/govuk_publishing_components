# Stripping Personally Identifiable Information (PII)

A module exists for stripping out PII from values. It can accept strings, query parameters, arrays or objects. If the value is an array or object, the child values are looped through and then treated as strings.

## What is redacted

The values that are redacted by default are:
- Email addresses - `email@gov.uk` becomes `[email]`
- Reset password tokens become `reset_password_token=[reset_password_token]`
- Unlock tokens become `unlock_token=[unlock_token]`
- State values become `state=[state]`

Additional values that can be redacted are:
- Dates - `2022-02-22` becomes `[date]`
- Postcodes - `sw1a 1aa` becomes `[postcode]`

These aren't enabled by default due to the higher likelihood of producing false positives.

## Basic use
```JavaScript
var PIIRemover = new GOVUK.PIIRemover()

var myInfo = 'this is an@email.com address, this is a 2019-01-21 date, this is a sw1a 1aa postcode,'

var example1 = PIIRemover.stripPII(myInfo)
// this is [email] address, this is a 2019-01-21 date, this is a sw1a 1aa postcode

var example2 = PIIRemover.stripPIIWithOverride(myInfo, true, false)
// this is [email] address, this is a [date] date, this is a sw1a 1aa postcode

var example3 = PIIRemover.stripPIIWithOverride(myInfo, true, true)
// this is [email] address, this is a [date] date, this is a [postcode] postcode

var myObject = {'email': 'email@gov.uk', 'other': 'value', 'piiSafe': new PIIRemover.PIISafe('example@gov.uk')}

var example4 = PIIRemover.stripPII(myObject)
// {'email' : '[email]', 'other': 'value', 'piiSafe': 'example@gov.uk'}

var myArray = ['email@gov.uk', 'hello world']
var example5 = PIIRemover.stripPII(myArray)
// ['[email]', 'hello world']

// Meta tag of <meta name="govuk:ga4-strip-query-string-parameters" content="strip-parameter-1,strip-parameter-2" />
var myQueryString = '/test?strip-parameter-1=secret&strip-parameter-2=more-secret'
var example6 = PIIRemover.stripPII(myQueryString)
// /test?strip-parameter-1=[strip-parameter-1]&strip-parameter-2=[strip-parameter-2]
```

## Enabling additional redaction

To enable additional redaction you can add meta tags to your application via the `Meta Tags` publishing component.

### For dates and postcodes:

```Ruby
<%= render "govuk_publishing_components/components/meta_tags", {
  content_item: null,
  local_assigns: {
    strip_dates_pii: true,
    strip_postcodes_pii: true
  }
} %>
```

The `shouldStripDates()` and `shouldStripPostcodes()` functions in the JavaScript will then check if these values exist in order to strip dates and postcodes.

However, this will redact dates and postcodes from every call of the PIIRemover. In order to apply extra redaction to specific values, you can use the `stripPIIWithOverride()` function.

### For query string parameters:

Query string parameters are redacted if there is presence of a `meta[name="govuk:ga4-strip-query-string-parameters"]` meta tag, with comma separated query string parameters keys in its `content` attribute. The usage of this query string PII removal in production is unknown at this time.

Add this meta tag with your query string parameter keys in the `content` section:
`<meta name="govuk:ga4-strip-query-string-parameters" content="query-string-key-1,query-string-key-2"`


## Using the stripPIIWithOverride() function

You can call this function to manually enable the date or postcode stripping on a specific value:

```JavaScript
var enableDateStripping = true
var enablePostCodeStripping = true
var myRedactedValue = this.PIIRemover.stripPIIWithOverride(myValue, enableDateStripping, enablePostcodeStripping)
```

### Preventing redaction from running on a value

There is a `PIISafe` class that you can wrap your objects or strings in.

`var myValue = new this.PIIRemover.PIISafe(myValue)`

If `myValue` is then passed through to a `stripPII` function, instead of having its PII redacted, its original value will be returned, bypassing any redaction.
