$(document).bind('autofocus_ready', function() {
    if (!("autofocus" in document.createElement("input"))) {
      $("#q").focus();
    }
});