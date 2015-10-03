"use strict";

var Cambridge = require("./dictionary/cambridge.js");

module.exports = {
	list: function () { 
		return ["cambridge"]; 
	},

	create: function (name) {
		switch (name) {
			case "cambridge":
				return new Cambridge();
			default:
				throw "Invalid dictionary " + name;
		}
	}
}