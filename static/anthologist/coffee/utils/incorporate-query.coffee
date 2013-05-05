define ->

  incorporateQuery = (options) ->

    if options and options.hasOwnProperty "query"
      queryParams = []
      for param in options.query
        queryParams.push "#{param}=#{options.query[param]}"
      return "?#{queryParams.join('&')}"

    else
      return ""

  return incorporateQuery