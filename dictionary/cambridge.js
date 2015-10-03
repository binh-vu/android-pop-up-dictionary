"use strict";

var request = require('request'),
		cherrio = require("cheerio"),
		Promise = require("bluebird"),
		util = require("util"),
		logManager = require("../logger.js");

var logger = logManager.getLogger("dictionary")

module.exports = function () {
	var _this = this;

	this.lookupURL = "http://dictionary.cambridge.org/search/english/direct/?q=%s";
	this.suggestURL = "http://dictionary.cambridge.org/autocomplete/english/?q=%s&contentType=application%2Fjson%3B+charset%3Dutf-8";

	this.errorXPath = ["#informational-content h2", "#cdo-spellcheck-container"];

	this.lookup = function (word) {
		logger.debug(util.format("[cambridge] - lookup: %s", util.format(_this.lookupURL, word)));

		return new Promise(function (resolve, reject) {
			request.get(util.format(_this.lookupURL, word), function (err, res, body) {
				if (err) return reject({
					message: "exception",
					error: err
				});

				var $ = cherrio.load(body);
				
				for (var i = 0; i < _this.errorXPath.length; i++) {
					var errorNode = $(_this.errorXPath[i]);
					if (errorNode.length != 0) {
						return reject({
							message: "not_found", 
							error: errorNode.html(),
						});
					}
				}

				try {
					var word = $(".di-body .pos-header .di-title .headword .hw").html();
					var definitions = [];
					var defHeads = $(".di-body .pos-body .sense-body .def-head");
					var defBodys = $(".di-body .pos-body .sense-body .def-body");

					for (var i = 0; i < defHeads.length; i++) {
						definitions.push({
							head: $(defHeads[i]).text(),
							body: $(defBodys[i]).text()
						});
					}

					return resolve({
						word: word,
						definitions: definitions
					});
				} catch (e) {
					return reject({
						message: "exception",
						error: e
					});
				}
			}); 
		});
	}

	this.suggest = function (query) {
		logger.debug(util.format("[cambridge] - suggest: %s", util.format(_this.suggestURL, query)));

		return new Promise(function (resolve, reject) {
			request.get(util.format(_this.suggestURL, query), function (err, res, body) {
				if (err) {
					return reject({
						message: "exception",
						error: err
					});
				}

				return resolve(JSON.parse(body).results.map(function (x) { return x.searchtext; }))
			});
		});
	}
}
