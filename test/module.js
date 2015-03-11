(function() {
  "use strict";

  var assert = require("assert");

  describe("events", function(){

    var CartodbClient = require("../src/cartodb-client.js");

    function getMockXHR(responsesType) {

      var responses = {
        goodXHRResponse : {
          "status" : 200,
          "responseText" : "{\"test\"}"
        },
        badXHRResponseStatus : {
          "status" : 500,
          "responseText" : "{\"test\"}"
        },
        badXHRResponseData : {
          "status" : 200,
          "responseText" : "notJSON"
        }
      };

      return function() {
        var outs = {
          "onreadystatechange" : null,
          "send" : function () {
            return outs.onreadystatechange();
          },
          "open" : function () {
            return true;
          }
        }

        return outs;
      };
    }

    it('should have all required functions', function(done){

      var client = CartodbClient().getClient("test", "test", {

        //
        // Mock XHR
        //
        "XHR" : getMockXHR("goodXHRResponse")
      });

      client.sqlRequest("mockQuery", function() {
        done();
      });
    });

  });
}());
