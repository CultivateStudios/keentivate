/* globals keentivateChart */
var keentivateMultiline = function() {
	this.init(arguments);
};

//Faux inheritance
keentivateMultiline.prototype = Object.create(keentivateChart.prototype);

keentivateMultiline.prototype.requiredAttributes = {
	"timeframe": "timeframe",
	"interval": "interval",
	"event": "eventCollection",
	"group": "groupBy"
}

keentivateMultiline.prototype.init = function() {
	var self = this;

	self.chartType = "line";

	self.super.apply(self, arguments[0]);
};

keentivateMultiline.prototype.getMetric = function() {
	var self = this;

	if(self.stop) {
		return false;
	}

	self.metric = new Keen.Series(self.getField("event"), self.getMetricOptions());

	var filters = self.getFilters();

	for(var i=0, max=filters.length; i<max; i++) {
		var filter = filters[i];
		self.metric.addFilter(filter.property, filter.operator, filter.value);
	}
};

keentivateMultiline.prototype.draw = function() {
	var self = this;

	if(self.stop) {
		return false;
	}

	var chart = new Keen.MultiLineChart(self.metric, self.getLabelOptions());
	chart.draw(self.element);
};
