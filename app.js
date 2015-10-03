"use strict";

var login = require("./chat-api.js").login,
		config = require("./config.json"),
		controller = require("./controller.js"),
		dictionary = require("./dictionary.js"),
		logManager = require("./logger.js");

// { threadID: { allow: true/false, dictionary: object } }
var threads = {},
		logger = logManager.getLogger("app"); 

login({ email: config.botEmail, password: config.botPassword }, function (err, api) {
	if (err) return logger.error(err);

	api.listen(function (err, message) {
		if (!threads[message.threadID]) {
			if (message.body == config.secretPassword) {
				threads[message.threadID] = {
					allow: true,
					dictionary: dictionary.create(config.defaultDictionary)
				};

				logger.info("New comer: " + message.threadID);
				return api.sendMessage("Welcome to android pop-up dictionary", message.threadID);
			}

			return api.sendMessage(config.deniedMessage, message.threadID);
		}

		var request = {
			thread: threads[message.threadID],
			message: message.body.trim()
		}
		
		controller
			.handle(request)
			.then(function (response) {
				api.sendMessage(response, message.threadID);		
			});
	});
});