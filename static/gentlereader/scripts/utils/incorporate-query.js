define(function() {
  var incorporateQuery;
  incorporateQuery = function(options) {
    var param, queryParams, _i, _len, _ref;
    if (options && options.hasOwnProperty("query")) {
      queryParams = [];
      _ref = options.query;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        param = _ref[_i];
        queryParams.push("" + param + "=" + options.query[param]);
      }
      return "?" + (queryParams.join('&'));
    } else {
      return "";
    }
  };
  return incorporateQuery;
});
