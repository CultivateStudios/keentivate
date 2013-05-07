var keentivateChart = function() {
	this.init(arguments);
};

keentivateChart.prototype.super = function(keentivate, element) {
	var self = this;

	if(typeof(keentivate) === "undefined") {
		throw new Error("You have to pass keentivate to keentivateChart");
	}

	self.k = keentivate;

	if(typeof(element) === "undefined") {
		console.log(self.k);
		self.k.log("You have to pass an element to keentivateChart");
	}

	self.element = element;
	self.stop = false;

	if(typeof(self.options) === "undefined") {
		self.options = {};
	}

	var defaults = {
		metric: {
			analysisType: "count"
		},
		label: {

		}
	};

	self.options = self.k.merge(defaults, self.options);

	self.startRender();
};

keentivateChart.prototype.requiredAttributes = {
	"event": "eventCollection"
};

keentivateChart.prototype.optionalMetricAttributes = {
	"metric-type": "analysisType",
	"filters": "filters",
	"timeframe": "timeframe",
	"group": "groupBy",
	"target": "targetProperty",
	"timeframe": "timeframe",
	"interval": "interval"
};

keentivateChart.prototype.optionalLabelAttributes = { 
	"label": "label",
	"title": "title",
	"prefix": "prefix",
	"suffix": "suffix",
	"height": "height",
	"width": "width",
	"font": "font-family",
	"font-color": "fontColor",
	"border-radius": "border-radius",
	"color": "color",
	"colors": "colors",
	"number-background": "number-background-color",
	"label-background": "label-background-color",
	"x": "xAxisLabel",
	"y": "yAxisLabel",
	"x-angle": "xAxisLabelAngle",
	"background": "backgroundColor",
	"chart-height": "chartAreaHeight",
	"chart-width": "chartAreaWidth",
	"chart-top": "chartAreaTop",
	"chart-left": "chartAreaLeft",
	"line-width": "lineWidth",
	"show-legend": "showLegend",
	"label-mapping": "labelMapping",
	"minimum-slice": "minimumSlicePercentage"
};

//Order of operations function.  Stored in prototype so that child objects can override it.
keentivateChart.prototype.startRender = function() {
	var self = this;

	self.checkRequiredFields();
	self.getMetric();

	if(typeof(self.draw) === "function") {
		self.draw();
	}
};

keentivateChart.prototype.getMetric = function() {
	var self = this;

	if(self.stop) {
		return false;
	}

	self.metric = new Keen.Metric(self.getField("event"), self.getMetricOptions());

	var filters = self.getFilters();

	for(var i=0, max=filters.length; i<max; i++) {
		var filter = filters[i];
		self.metric.addFilter(filter.property, filter.operator, filter.value);
	}
};

keentivateChart.prototype.getFilters = function() {
	var self = this;

	var replacements = {
		"=": "%DOSPLIT%eq%DOSPLIT%",
		"!=": "%DOSPLIT%ne%DOSPLIT%",
		"<": "%DOSPLIT%lt%DOSPLIT%",
		"<= ": "%DOSPLIT%lte%DOSPLIT%",
		">": "%DOSPLIT%gt%DOSPLIT%",
		">=": "%DOSPLIT%gte%DOSPLIT%",
		"\\?": "%DOSPLIT%exists%DOSPLIT%"
	};

	var filterAttr = self.getField("filter");

	if(filterAttr) {
		//Do replacements en masse, so we don't have to loop on each filter
		for(key in replacements) {
			filterAttr = filterAttr.replace(new RegExp(key, "g"), replacements[key]);
		}

		var filters = filterAttr.split("|");
		var filterArray = [];

		for(var i=0,max=filters.length; i<max; i++) {
			var trimmed = filters[i].replace(/^\s\s*/, '').replace(/\s\s*$/, '');

			while(trimmed.indexOf("  ") > -1) {
				trimmed.replace("  ", " ");
			}

			//Fake out spaces until after the split, please.


			var split = trimmed.split("%DOSPLIT%");
			if(split.length == 3) {

				if(split[2] === "true") {
					split[2] = true;
				} else if(split[2] === "false") {
					split[2] = false;
				}
				
				filterArray.push({
					property: split[0],
					operator: split[1],
					value: split[2]
				});
			}
		}

		return filterArray;
	} else {
		return [];
	}
}

keentivateChart.prototype.checkRequiredFields = function() {
	var self = this;

	if(self.stop) {
		return false;
	}

	if(typeof(self.requiredAttributes) === "undefined") {
		self.k.log("No required attributes defined");
		self.stop = true;
		return false;
	}

	var failed = false;

	for(var key in self.requiredAttributes) {
		if(!self.element.hasAttribute("keen-" + key) && !(key === "timeframe" && self.element.hasAttribute("keen-start") && self.element.hasAttribute("keen-end"))) {
			self.k.log("Required key not set on keen element: "+key);
			failed = true;
			break;
		}
	}

	if(failed) {
		self.stop  = true;
	}

	return !failed;
};

keentivateChart.prototype.getMetricOptions = function() {
	return this.k.merge(this.options.metric, this.getOptions(this.optionalMetricAttributes));
};

keentivateChart.prototype.getLabelOptions = function() {
	return this.getOptions(this.optionalLabelAttributes);
};

keentivateChart.prototype.getOptions = function(optionFields) {
	var self = this;

	if(self.stop) {
		return false;
	}

	var options = {};

	for(var key in optionFields) {
		if(self.element.hasAttribute("keen-"+key)) {
			options[optionFields[key]] = self.element.getAttribute("keen-"+key);
		} else if(key === "timeframe" && self.element.hasAttribute("keen-start") && self.element.hasAttribute("keen-end")) { //Allow start & end timeframes
			options[optionFields[key]] = {
				start: self.element.getAttribute("keen-start"),
				end: self.element.getAttribute("keen-end")
			}
		}
	}

	return options;
};

keentivateChart.prototype.getField = function(field) {
	var self = this;

	if(self.stop) {
		return false;
	}

	if(!self.element.hasAttribute("keen-"+field)) {
		return false;
	}

	return self.element.getAttribute("keen-"+field);
};

keentivateChart.prototype.onRender = function() {
	var self = this;

	if(self.element.hasAttribute("keen-on-render")) {
		var func = self.element.getAttribute("keen-on-render");

		eval(func);
	}
};
