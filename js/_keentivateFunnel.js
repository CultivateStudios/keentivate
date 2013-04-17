/* globals keentivateChart */
var keentivateFunnel = function() {
	this.init(arguments);
};

//Faux inheritance
keentivateFunnel.prototype = Object.create(keentivateChart.prototype);

keentivateFunnel.prototype.requiredAttributes = {
	"watch": "actorProperty"
}

keentivateFunnel.prototype.optionalMetricAttributes = {
	"watch": "actorProperty"
};

keentivateFunnel.prototype.optionalLabelAttributes = {
	"title": "title"
};

keentivateFunnel.prototype.init = function() {
	var self = this;

	self.chartType = "pie";

	self.super.apply(self, arguments[0]);
};

keentivateFunnel.prototype.draw = function() {
	var self = this;

	if(self.stop) {
		return false;
	}

	var chart = new Keen.Funnel(self.steps, self.getMetricOptions());

	chart.draw(self.element);
};

keentivateFunnel.prototype.getSteps = function() {
	var self = this;

	var lis = self.element.getElementsByTagName("li");

	if(!lis.length) {
		self.stop = true;
		self.k.log("You must provide steps for funnels")
		return false;
	}

	self.steps = [];

	for(var i=0, max=lis.length; i<max; i++) {
		var li = lis[i];

		if(!li.hasAttribute("keen-event")) {
			self.stop = true;
			self.k.log("All steps must have an event attribute");
			return false;
		}

		var ev = li.getAttribute("keen-event");

		self.steps.push(new Keen.Step(ev));
	}

};

keentivateFunnel.prototype.startRender = function() {
	var self = this;

	self.checkRequiredFields();
	self.getSteps();
	self.draw();
	
};
