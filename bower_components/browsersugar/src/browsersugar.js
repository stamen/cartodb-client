(function() {
  "use strict";

  var listeners = {},
      data      = {};

  var interfaceMethods = {

      //
      // Gets an element by selector. Uses JQuery if available.
      //
      getElements : function get(selector, root) {
        return ((root) ? root : document).querySelectorAll(selector);
      },

      //Lifted from http://davidwalsh.name/javascript-debounce-function
      debounce : function debounce(func, wait, immediate) {
        var timeout;
        return function() {
          var context = this, args = arguments;
          var later = function() {
            timeout = null;
            if (!immediate) {func.apply(context, args);}
          };
          var callNow = immediate && !timeout;
          clearTimeout(timeout);
          timeout = setTimeout(later, wait);
          if (callNow) {func.apply(context, args);}
        };
      },

      request : function(uri, callback) {
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
      },

      parentHasClass : function(startingElement, className, depth) {

        var last  = startingElement;

        for (var i=0; (depth||10) > i && last; i++) {

          if (last && last.className && last.className.indexOf(className) > -1) {
            return last;
          }

          last = last.parentNode;

        }

        return null;
      },

      append : function(rootNode, html) {
        var div = document.createElement("div");
        div.innerHTML = html;
        while (div.children.length > 0) {
          rootNode.appendChild(div.children[0]);
        }

        return rootNode;
      }

    };

    var browsersugar = {
      "mix" : function (object) {
        for (var i in interfaceMethods) {
          object[i] = interfaceMethods[i];
        }

        return object;
      },
      "extend" : function (instance) {

        for (var i in interfaceMethods) {
          instance.prototype[i] = interfaceMethods[i];
        }

        return instance;
      }
    };

    //
    // If this is a CommonJS module
    //
    if (typeof module === "object" && module.exports) {
      module.exports = browsersugar;
    }

    //
    // If this is an AMD module
    //
    if (typeof define === "function") {
      define(browsersugar);
    }

    //
    // If just exports and it's an object
    //
    if (typeof module !== "object" && typeof exports === "object") {
      exports.browsersugar = browsersugar;
    }

    //
    // If none of those, add it to Window (as long as there is nothing named samesies)
    //
    if (typeof define !== "function" && typeof window === "object") {
      if (!window.STPX) {
        window.STPX = {};
      }
      window.STPX.browsersugar = browsersugar;
    }
}());
