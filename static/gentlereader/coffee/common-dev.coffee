requirejs.config

  baseUrl: "/static/gentlereader/scripts"

  paths:
    jquery: "//ajax.googleapis.com/ajax/libs/jquery/2.0.3/jquery.min"
    underscore: "lib/lodash.custom"
    backbone: "lib/backbone"
    typeahead: "lib/typeahead"
    jade: "lib/jade-runtime"

  shim:
    underscore:
      exports: "_"

    backbone:
      deps: ["underscore", "jquery"]
      exports: "Backbone"

    typeahead:
      deps: ["jquery"]
      exports: "typeahead"

    jade:
      exports: "jade"

require ['base-main']