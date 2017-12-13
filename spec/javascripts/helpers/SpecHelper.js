beforeEach(function () {
  jasmine.addMatchers({
    toBeEqualAsJSON: function (util, customEqualityTesters) {
      return {
        compare: function (actual, expected) {
          var actualAsJSON = JSON.stringify(actual);
          var expectedAsJSON = JSON.stringify(expected);

          var result = {};

          result.pass = actualAsJSON === expectedAsJSON;

          if (result.pass)
            result.message = "Expected " + actualAsJSON + " not to be equal to " + expectedAsJSON + " once converted to JSON";
          else
            result.message = "Expected " + actualAsJSON + " to be equal to " + expectedAsJSON + " once converted to JSON";

          return result;
        }
      }
    }
  });
});
