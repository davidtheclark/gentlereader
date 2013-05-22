requirejs.config

  baseUrl: "/static/anthologist/build"

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