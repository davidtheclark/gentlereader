/* Sets up a pseudo-global namespace so that variables
 * can be easily passed from module to module. */

define(function () {
	var globals = {};
	return {
		getGlobals: function () { return globals; }
	};
});