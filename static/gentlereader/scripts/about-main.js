require(["jquery", "apps/rand-quot-app", "lib/unfinishedToggler"], function($, RandQuotApp, unfinishedToggler) {
  return $(function() {
    new RandQuotApp();
    return $("#about").unfinishedToggler({
      exclusive: false
    });
  });
});
