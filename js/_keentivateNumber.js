/* globals keentivateChart */
var keentivateNumber = function() {
	this.init(arguments);
};

//Faux inheritance
keentivateNumber.prototype = Object.create(keentivateChart.prototype);

keentivateNumber.prototype.init = function() {
	var self = this;

	self.chartType = "number";

	self.super.apply(self, arguments[0]);
};

keentivateNumber.prototype.draw = function() {
	var self = this;

	if(self.stop) {
		return false;
	}

	var chart = new Keen.Number(self.metric, self.getLabelOptions());
	chart.draw(self.element);
};
