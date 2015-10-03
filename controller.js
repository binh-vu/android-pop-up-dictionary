"use strict";

var util = require("util"),
		logManager = require("./logger.js"),
		dictionary = require("./dictionary.js");

var logger = logManager.getLogger("controller");

function handler(request) {
	return new Promise(function (resolve, reject) {
		// update chat bot behaviour
		if (request.message.indexOf(":") != -1) {
			logger.debug(util.format("Change settings: %s", request.message));

			var splitPoint = request.message.indexOf(":"),
					method = request.message.substring(0, splitPoint),
					param = request.message.split(splitPoint);

			switch (method) {
				case "dict":
					try {
						request.thread.dictionary = dictionary.create(param);
					} catch (e) {
						return resolve(util.format(
							"Invalid dictionary %s, current support dictionaries are %s", 
							param, dictionary.list()
						));
					}

					return resolve("Change dictionary success");
				default:
					return resolve("Invalid method " + method);
			}
		}

		// perform suggestion
		if (request.message.indexOf("?") != -1) {
			logger.debug(util.format("Suggest: %s", request.message));

			var query = request.message.substring(0, request.message.indexOf("?"));
			return request.thread.dictionary
				.suggest(query)
				.then(function (candidates) {
					var res = candidates
						.map(function (c) { return util.format("+    %s", c); })
						.join("\n");
					res = "Suggestion: \n" + res;
					return resolve(res);		
				})
				.error(function (e) {
					logger.error(e);
					resolve(JSON.stringify(e));
				});
		}

		logger.debug(util.format("Lookup: %s", request.message));
		request.thread.dictionary
			.lookup(request.message)
			.then(function (res) {
				var res = util.format(
					"** %s\n\n%s", 
					res.word, res.definitions.map(function (def) {
						return util.format("+ %s\n    %s", def.head, def.body);
					}).join("\n")
				);

				resolve(res);
			})
			.error(function (error) {
				logger.error(error);
				resolve(JSON.stringify(error));
			});
	});
}

module.exports = {
	handle: handler
}