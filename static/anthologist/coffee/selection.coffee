accordion =

  mothers: []
  
  go: (options) ->
    
    $.extend @, options
  
    # Find all accordion-mothers, and for each one run @add.
    @getMothers()
    for $m in @mothers
      @add $m
  
  getMothers: ->
    # Find each accordion-mother and push it to @mothers
    app = @
    $(".accMother").each ->
      app.mothers.push $(this)
  
  add: ($m) ->
    app = @
    
    # Find all accordion-items and give them an attribute
    # data-mother with a value of the mother's id  
    id = $m.attr "id"
    $items = $m.find ".accItem"
    $items.data "mother", id
  
    # Find all the triggers.
    triggers = $m.find ".accTrigger"
    
    # When a trigger is clicked, run @change
    triggers.click ->
        app.change $(this), $items, $m
  
  changeState: (action, $obj) ->
    if action == "show"
      $obj.removeClass("u-inactive").addClass("u-active") if $obj.hasClass("u-inactive")
    else if action == "hide"
      $obj.removeClass("u-active").addClass("u-inactive") if $obj.hasClass("u-active")
  
  change: ($trigger, $items, $mother) ->
    app = @
    
    # Find the accordion-item that the trigger applies to
    $thisItem = $items.has $trigger
    
    # Create an array of the other, sibling accordion-items.
    $otherItems = $items.not($thisItem)
    
    ###
    If thisItem is inactive, make it active;
    and if the accordion is marked oneAtATime = true,
    hide any other open accordion-items.
    If the accordion is marked closeAll = true
    and thisItem is active, make it inactive.
    ###
    
    if $thisItem.hasClass "u-inactive"
      app.changeState "show", $thisItem
      
      if app.oneAtATime
        $otherItems.each ->
          app.changeState "hide", $(this)
    
    else if $thisItem.hasClass("u-active") and app.closeAll
      app.changeState "hide", $thisItem
    
    # If there are special stylings, defined in accordion.style, do them.
    if accordion.style
      accordion.style($trigger, $items, $mother)
    
$ ->

  accordion.style = ($trigger, $items, $mother) ->
    $triggers = $mother.find ".accTrigger"
    
    isOpen = false
    $items.each ->
      if $(this).hasClass "u-active"
        isOpen = true

    if isOpen
      $triggers.addClass "u-wide"
    
    else
      $triggers.removeClass "u-wide"

  accordion.go
    oneAtATime: false
    closeAll: true