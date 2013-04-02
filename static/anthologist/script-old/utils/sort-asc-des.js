define(function () {
	var sortAscDes = function (dir, a, b) {
		if (dir === 'asc') {
			if (a < b) return -1;
			if (a > b) return 1;	
		} else {
			if (a < b) return 1;
			if (a > b) return -1;
		}
		return 0;
	};
	return sortAscDes;
});