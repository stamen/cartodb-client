(function(exports) {
  "use strict";

  function CartoDBClient() {

    var that    = this,
        options = {},
        apiKey, accountName;


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
          outString = outString.split("{"+i+"}").join(data[i]);
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
          options.remoteSQLMethod,
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
      apiKey      = _apiKey;
      accountName = _accountName;

      _options = _options || {};
      _options.accountName     = _accountName;
      _options.apiKey          = _apiKey;
      _options.format          = _options.format          || "GeoJSON";
      _options.apiroot         = _options.apiroot         || "http://{accountName}.cartodb.com/api/v2/";
      _options.remoteSQLMethod = _options.remoteSQLMethod || "sql";

      options = _options;

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

  if (window.define) {
    //
    // Treat as an AMD module
    //
    define(CartoDBClient);
  } else {
    //
    // Add to scope
    //
    exports.CartoDBClient = CartoDBClient;
  }

}(typeof exports === "object" ? exports : window));
