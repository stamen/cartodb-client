(function() {
  "use strict";

  function CartoDBClient(accountName,options) {

    options = options || {};

    var that = this;

    options.apiroot     = options.apiroot      || "http://{accountName}.cartodb.com/api/v2/";
    options.format      = options.format       || "GeoJSON";
    options.accountName = options.accountName  || accountName;

    //
    // Request remote data
    //
    function request(uri, callback) {

      if (window && window.XMLHttpRequest) {
        var xmlHttp = null;

        xmlHttp = new window.XMLHttpRequest();

        xmlHttp.onreadystatechange = function() {
          if ((xmlHttp.readyState|0) === 4) {
            if ((xmlHttp.status|0) === 200 ) {

              callback(null, xmlHttp);
            } else {
              callback(xmlHttp);
            }
          }
        };

        xmlHttp.open( "GET", uri, true );
        return xmlHttp.send( null );
      } else {
        return false;
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
    function sqlRequest(sql, callback, _options) {

      _options = _options || {};

      //
      // Override defaults
      //
      if (Object.keys(_options).length) {
        for (var i in _options) {

          if (_options.hasOwnProperty(i)) {

            options[i] = _options[i];

          }

        }
      }

      return request(
        buildTemplate([
          buildTemplate(options.apiroot, options),
          "sql",
          "&format=" + options.format,
          "&q=" + sql
        ].join(""), options),
        function (err, response) {

          try {
            callback(err, JSON.parse(response.responseText), response);
          } catch (err) {
            callback(err, null, response);
          }

        }
      );

    }

    //
    // Public interface
    //
    that.sqlRequest = sqlRequest;

    return that;

  }



  //
  // If this is a CommonJS module
  //
  if (typeof module === "object" && module.exports) {
    module.exports = CartoDBClient;
  }

  //
  // If this is an AMD module
  //
  if (typeof define === "function") {
    define(CartoDBClient);
  }

  //
  // If just exports and it's an object
  //
  if (typeof module !== "object" && typeof exports === "object") {
    exports.CartoDBClient = CartoDBClient;
  }

  //
  // If none of those, add it to Window (as long as there is nothing named samesies)
  //
  if (typeof define !== "function" && typeof window === "object") {
    if (!window.STMN) {
      window.STMN = {};
    }
    window.STMN.CartoDBClient = CartoDBClient;
  }

}());
