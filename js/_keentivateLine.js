/* globals keentivateChart */
var keentivateLine = function() {
	this.init(arguments);
};

//Faux inheritance
keentivateLine.prototype = Object.create(keentivateChart.prototype);

keentivateLine.prototype.requiredAttributes = {
	"timeframe": "timeframe",
	"interval": "interval",
	"event": "eventCollection"
}

keentivateLine.prototype.init = function() {
	var self = this;

	self.chartType = "line";

	self.super.apply(self, arguments[0]);
};

keentivateLine.prototype.getMetric = function() {
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

keentivateLine.prototype.draw = function() {
	var self = this;

	if(self.stop) {
		return false;
	}

	var chart = new Keen.LineChart(self.metric, self.getLabelOptions());
	chart.draw(self.element);
};
