/* globals keentivateChart */
var keentivateBar = function() {
	this.init(arguments);
};

//Faux inheritance
keentivateBar.prototype = Object.create(keentivateChart.prototype);

keentivateBar.prototype.requiredAttributes = {
	"event": "eventCollection",
	"group": "groupBy"	
}

keentivateBar.prototype.init = function() {
	var self = this;

	self.chartType = "bar";

	self.super.apply(self, arguments[0]);
};

keentivateBar.prototype.draw = function() {
	var self = this;

	if(self.stop) {
		return false;
	}

	var chart = new Keen.BarChart(self.metric, self.getLabelOptions());

	chart.draw(self.element);
};
