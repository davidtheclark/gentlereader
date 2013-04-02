tabber =
  ###
  Presumes that element classed .tabber has children
  .tabber-tab (with children .tabber-expand and .tabber-collapse)
  and .tabber-body, and these tabs or bodies are classed as
  u-active or u-inactive. Corresponding -tabs and -bodies have
  matching data-tabber attributes.
  ###

  initialize: ->
    # Hides collapses and bodies, then binds triggers
    @bindTabs()
  
  bindTabs: ->
    # Makes clicking a .toggler-trigger call toggleNow
    self = @
    
    _findMothers = ->
      mothers = $(".tabber")
      mothers.each ->
        _findTabs $(@)
    
    _findTabs = ($mother) ->
      tabs = $mother.find ".tabber-tab"
      tabs.each ->
        _bindEm $(@), $mother
     
    _bindEm = ($tab, $mother) ->
      $tab.click ->
        self.tabNow $tab, $mother
        
    _findMothers()

  tabNow: ($tab, $mother) ->
    ###
    For all parts of the .tabber: if it is active, make it
    inactive; if is inactive and corresponds with the clicked
    tab, make it active.
    ###
  
    dataId = $tab.data "tabber"
    parts = $mother.find ".tabber-tab, .tabber-body"
    parts.each ->
      $it = $(@)
      if $it.data('tabber') == dataId and $it.hasClass "u-inactive"
        $it.removeClass("u-inactive").addClass("u-active")
      else if $it.hasClass "u-active"
        $it.removeClass("u-active").addClass("u-inactive")

###
// TABBER

$tab-timing: 1s ease

.tabber-body
  +transition( (opacity $tab-timing, height $tab-timing) )
  &.u-inactive
    opacity: 0
    height: 0
    overflow: hidden
  &.u-active 
    opacity: 1
    height: auto

.tabber-tab
  &.u-inactive
    .tabber-collapse 
      display: none    
    .tabber-expand 
      display: block
  &.u-active
    .tabber-collapse 
      display: block
    .tabber-expand 
      display: none
###