/* Takes a string and returns that string stripped of
 * leading articles (the, an, a), since a good sorter 
 * should ignore these (e.g. putting "the pig" after "pie"
 * instead of after "thane"). */

define(function () {
	var ignoreArticles = function (string) {
		if (string.match(/^the /i)) {
			return string.substring(4);
		}
		else if (string.match(/^an /i)) {
			return string.substring(3);
		}
		else if (string.match(/^a /i)) {
			return string.substring(2);
		}
		else {
			return string;
		}
	}
	return ignoreArticles;
})