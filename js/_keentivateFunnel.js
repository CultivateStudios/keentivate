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

	chart.draw(self.element, self.getLabelOptions());
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

		if(!li.hasAttribute("data-keen-event")) {
			self.stop = true;
			self.k.log("All steps must have an event attribute");
			return false;
		}

		var ev = li.getAttribute("data-keen-event");

		var filters = self.getStepFilters(li);

		var step = new Keen.Step(ev);
		for(var j=0,fmax=filters.length;j<fmax;j++) {
			step.addFilter(filters[j].property, filters[j].operator, filters[j].value)
		}

		self.steps.push(step);
	}

};

keentivateFunnel.prototype.getStepFilters = function(ele) {
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

	if(!ele.hasAttribute("data-keen-filter")) {
		return [];
	}

	var filterAttr = ele.getAttribute("data-keen-filter");

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

keentivateFunnel.prototype.startRender = function() {
	var self = this;

	self.checkRequiredFields();
	self.getSteps();
	self.draw();
	
};
