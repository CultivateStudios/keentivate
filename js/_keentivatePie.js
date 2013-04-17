/* globals keentivateChart */
var keentivatePie = function() {
	this.init(arguments);
};

//Faux inheritance
keentivatePie.prototype = Object.create(keentivateChart.prototype);

keentivatePie.prototype.requiredAttributes = {
	"event": "eventCollection",
	"group": "groupBy"	
}

keentivatePie.prototype.init = function() {
	var self = this;

	self.chartType = "pie";

	self.super.apply(self, arguments[0]);
};

keentivatePie.prototype.draw = function() {
	var self = this;

	if(self.stop) {
		return false;
	}

	var chart = new Keen.PieChart(self.metric, self.getLabelOptions());

	chart.draw(self.element);
};
