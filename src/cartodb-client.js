(function() {
  "use strict";

  function CartoDBClient() {

    var that    = this,
        options = {},
        apiKey, accountName;


    //
    // Request remote data
    //
    function request(uri, callback) {
      if (options.XHR) {
        var xmlHttp = null;

        xmlHttp = new options.XHR();

        xmlHttp.onreadystatechange = function() {
          if ((xmlHttp.readyState|0) === 4 /*Done*/) {
            if ((xmlHttp.status | 0) === 200) {

              callback(null, xmlHttp);
            } else {
              callback(xmlHttp);
            }
          }
        };

        xmlHttp.open("GET", uri, true);
        return xmlHttp.send();
      } else {
        return callback(new Error('There is no XMLHttpRequest object available'));
      }
    }

    //
    // Build a string from a template and data
    //
    function buildTemplate(template, data) {
      var outString = template;

      for (var i in data) {
        if (data.hasOwnProperty(i)) {
          outString = outString.split("{" + i + "}").join(data[i]);
        }
      }

      return outString;
    }

    //
    // Request from the CartoDb SQL endpoint
    //
    function sqlRequest(sql, callback) {

      return request(
        buildTemplate([
          options.apiroot,
          "sql",
          "?api_key=" + apiKey,
          "&format=" + options.format,
          "&q=" + sql
        ].join(""), options),
        callback
      );

    }

    function getClient(_accountName, _apiKey, _options) {
      //
      // Set defaults
      //
      options.accountName     = _accountName;
      options.apiKey          = _apiKey;
      options.XHR             = _options.XHR              || ((typeof window === "object") ? window.XMLHttpRequest : null);
      options.format          = _options.format           || "GeoJSON";
      options.apiroot         = _options.apiroot          || "http://{accountName}.cartodb.com/api/v2/";

      return {
        "sqlRequest" : sqlRequest
      };
    }

    //
    // Public API methods
    //
    return {
      "getClient" : getClient
    };

  }

  if (typeof define === "object" && define.amd) {
    //
    // Treat as an AMD module
    //
    define(CartoDBClient);

  } else if (typeof module === 'object' && typeof module.exports === 'object') {

    module.exports = CartoDBClient;

  } else if (typeof window !== 'undefined') {
    //
    // Add to scope
    //

    window.CartoDBClient = CartoDBClient;
  }

}());
