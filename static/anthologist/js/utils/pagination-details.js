define(function () {
	/* Define pagination parameters: return "startEndMods",
	 * an array of objects that define each page's start and 
	 * end models and indices; and the pgCount.
	 * The function must be passed a
	 * Backbone Collection and an integer
	 * specifying the number of items per page. */
	var paginationDetails = function (collection, itemsPerPage) {
		var mods = collection.models;
		var colLen = collection.length;
		var pgCount = Math.ceil(colLen/itemsPerPage);
		var startEndMods = [];
		for (var i = 0; i < pgCount; i++) {
			var startIndex = i * itemsPerPage; 
			var endIndex = (i + 1) * itemsPerPage - 1;
			/* If the calculated endIndex will exceed the
			 * collection, replace it with the end of the
			 * collection. */ 
			var colEnd = colLen - 1;
			if (colEnd < endIndex) {
				endIndex = colEnd;
			}
			startEndMods[i] = {
				startIndex: startIndex,
				startMod: mods[startIndex],
				endIndex: endIndex,
				endMod: mods[endIndex]
			};
		}
		return {
			startEndMods: startEndMods,
			pgCount: pgCount
		}
	};
	return paginationDetails;
});