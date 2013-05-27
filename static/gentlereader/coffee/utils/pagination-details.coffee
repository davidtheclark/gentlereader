define ->
  ### Define pagination parameters: return "startEndMods",
  an array of objects that define each page's start and 
  end models and indices; and the pgCount. The function must
  be passed a Backbone Collection and an integer
  specifying the number of items per page. ###
  
  paginationDetails = (collection, itemsPerPage) ->
    
    models = collection.models
    colLength = collection.length
    pgCount = Math.ceil colLength / itemsPerPage
    startEndModels = []
    
    
    addPage = ->
      startIndex = i * itemsPerPage
      endIndex = (i + 1) * itemsPerPage - 1
      
      ### If the calculated endIndex will exceed the
      collection's length, replace it with the end of
      the colleciton. ###
      colEnd = colLength - 1
      endIndex = colEnd if colEnd < endIndex
      
      startEndModels[i] =
        startIndex : startIndex
        startModel : models[startIndex]
        endIndex : endIndex
        endModel : models[endIndex]
    
    addPage i for i in [0..pgCount - 1]
      
      
      
    return startEndModels : startEndModels, pgCount : pgCount
  
  
  return paginationDetails