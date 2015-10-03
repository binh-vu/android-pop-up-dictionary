"use strict";

var winston = require("winston");

module.exports = {
	getLogger: function (name) {
		var logfile;

		switch (name) {
			case "dictionary":
				logfile = "logs/dictionary.log";	
				break;
			case "app":
				logfile = "logs/app.log";
				break;
			case "controller":
				logfile = "logs/controller.log";
				break;
			default:
				throw "Invalid logger " + name;
		}

		return new (winston.Logger)({
	    transports: [
	      new (winston.transports.Console)({ level: 'info' }),
	      new (winston.transports.File)({ filename: logfile, level: 'debug' })
	    ]
	  });
	}
}