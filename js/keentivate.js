/*
	Codekit Imports
	---------------

	@codekit-append "_keenLoader"
	@codekit-append "_keentivateChart"
	@codekit-append "_keentivatePie"
	@codekit-append "_keentivateBar"
	@codekit-append "_keentivateNumber"
	@codekit-append "_keentivateFunnel"
	@codekit-append "_keentivateLine"
	@codekit-append "_keentivateMultiline"

*/
var keentivate = function(token, key, options, callback) {
	var self = this;

	self.ready = false;

	var defaults = {
		keenClass: false,
		timeframe: "previous_7_days"
	};

	if(typeof(token) === "undefined") {
		self.log("You must supply a token");
		return false;
	}

	if(typeof(key) === "undefined") {
		self.log("You must supply an API Key");
		return false;
	}

	if(typeof(options) === "function") {
		callback = options;
		options = null;
	}

	if(typeof(options) === "undefined" || options === null) {
		options = {};
	}

	self.options = self.merge(defaults, options);

	//Initialize Keen

	Keen.configure(token, key);
	Keen.onChartsReady(function() {

		if(self.options.keenClass) {
			self.load(self.options.keenClass, callback);
		} else {
			if(typeof(callback) === "function") {
				callback();
			}
		}
	});
};


/* Managing Elements */
keentivate.prototype.load = function(className, callback) {
	var self = this;

	var elements = document.getElementsByClassName(className);

	if(!elements.length) {
		self.log("No elements match that class name");
		return false;
	}

	self.unload();

	self.elements = elements;

	var sentinel = 0;
	var sentinelCheck = function() {
		sentinel++;

		if(sentinel >= max && typeof(callback) === "function") {
			callback();
		}
	};

	for(var i=0, max=self.elements.length; i<max; i++) {
		var ele = self.elements[i];

		var type = ele.hasAttribute("keen-type") ? ele.getAttribute("keen-type") : "number";

		var renderFunc = self.renderNumber;
		switch(type) {
			case "number":
				renderFunc = self.renderNumber;
				break;

			case "pie":
				renderFunc = self.renderPie;
				break;

			case "bar":
				renderFunc = self.renderBar;
				break;

			case "funnel":
				renderFunc = self.renderFunnel;
				break;

			case "line":
				renderFunc = self.renderLine;
				break;

			case "multiline":
				renderFunc = self.renderMultiline;
				break;

			default:
				self.log("Invalid keen-type attribute: " + type + ".  Assuming number");
				break;
		}

		renderFunc.apply(self, [ele, sentinelCheck]);
	}

};

keentivate.prototype.unload = function() {
	var self = this;
};

/* Renders */

keentivate.prototype.renderPie = function(ele, cb) {
	var self = this;

	var chart = new keentivatePie(self, ele, cb);
};

keentivate.prototype.renderBar = function(ele, cb) {
	var self = this;

	var chart = new keentivateBar(self, ele, cb);
};

keentivate.prototype.renderNumber = function(ele, cb) {
	var self = this;

	var chart = new keentivateNumber(self, ele, cb);
};

keentivate.prototype.renderFunnel = function(ele, cb) {
	var self =this;

	var chart = new keentivateFunnel(self, ele, cb);
};

keentivate.prototype.renderLine = function(ele, cb) {
	var self =this;

	var chart = new keentivateLine(self, ele, cb);
};

keentivate.prototype.renderMultiline = function(ele, cb) {
	var self =this;

	var chart = new keentivateMultiline(self, ele, cb);
};

/* Handy Functions */

//Overwrites base with override's properties
keentivate.prototype.merge = function(base, override) {
	var self = this;

    var merged = {};
    var attrname;
    for (attrname in base) { merged[attrname] = base[attrname]; }
    for (attrname in override) { merged[attrname] = override[attrname]; }
    return merged;
};

keentivate.prototype.log = function() {
	var self = this;

	[].unshift.apply(arguments, [Date.now()]);
	[].unshift.apply(arguments, ["Keentivate"]);

	console.log.apply(console, arguments);
};
