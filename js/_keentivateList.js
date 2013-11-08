/* globals keentivateChart */
var keentivateList = function() {
	this.init(arguments);
};

//Faux inheritance
keentivateList.prototype = Object.create(keentivateChart.prototype);

keentivateList.prototype.requiredAttributes = {
	"event": "eventCollection",
	"group": "groupBy",
	"label-field": "labelField"	
}

keentivateList.prototype.init = function() {
	var self = this;

	self.chartType = "list";

	self.super.apply(self, arguments[0]);
};

keentivateList.prototype.draw = function() {
	var self = this;

	if(self.stop) {
		return false;
	}

	var chart = new Keen.List(self.metric, self.getLabelOptions());

	chart.draw(self.element);
};

var buildInterval = setInterval(buildListChartType, 10);


function buildListChartType() {

	if(typeof(Keen.BaseVisualization) === "undefined") {
		return false;
	}

	clearInterval(buildInterval);
	console.log("creating ListChartType");
/**
     * List - A class to display the results of a metric.
     *
     * @param {Keen.Metric|Keen.SavedQuery} query The query you'd like to visualize.
     * @param {Object} options The options used to style the visualization (defaults are provided)
     * @param {String} [options.height="150px"] The height of the visualization.
     * @param {String} [options.width="300px"] The width of the visualization.
     * @param {String} [options.font-family="'Helvetica Neue', Helvetica, Arial, sans-serif"] Font family
     * @param {String} [options.color="white"] The color of the text in the visualization
     * @param {String} [options.border-radius="0px"] The border radius of the visualization
     * @param {String} [options.list-background-color="#7dcc77"] The color of the list background
     * @param {String} [options.title-background-color="#9CD898"] The color of the title background
     * @param {String} [options.prefix] A text prefix for the number.
     * @param {String} [options.suffix] A text suffix for the number.
     */
    Keen.List = Keen.BaseVisualization.extend({
        constructor : function(query, options){
            this.query = query;

            //These are the supported options and their default values.
            this.options = {
                width : "300px",
                "font-family" : "'Helvetica Neue', Helvetica, Arial, sans-serif",
                "fontSize": "1em",
                color: "white",
                "border-radius" : "0px",
                "list-background-color" : "#7dcc77",
                "title-background-color" : "#9CD898",
                "prefix" : "",
                "suffix" : "",
                "elementPadding": ".5em",
                "sortField": "result",
                "sortDirection": "desc"
            };

            this.options = _.extend(this.options, options);
        }
    });

    /**
     * Draws a List visualization
     *
     * @param {Element} element The HTML element in which to put the visualization
     * @param {Object} [response] The response from a query you'd like to visualize
     */
    Keen.List.prototype.draw = function(element, response){

        var value = function(val){
            return val.replace(/[^\d.-]+/gi, '');
        };

        var units = function(val){
            return val.replace(/[^A-Za-z%]+/gi, '');
        };

        element.innerHTML = "";

        //Create a div inside the element.
        var parentDiv = document.createElement("div");
        element.appendChild(parentDiv);

        //Place appropriate styles on it.
        parentDiv.style.width = this.options.width;
        parentDiv.style.display = "block";
        parentDiv.style.textAlign = "center";
        parentDiv.style.backgroundColor = this.options["list-background-color"];
        parentDiv.style.borderRadius = this.options["border-radius"];

        //Create the title element.
        var title = document.createElement("h2");
        this.options.label = this.options.title;  //So that we can use getLabel..  kinda hacky
        title.appendChild(document.createTextNode(this.getLabel()));
        parentDiv.appendChild(title);

        //Place appropriate styles on it.
        title.style.lineHeight = title.style.height;
        title.style["font-size"] = ((value(this.options.fontSize)) * 2) + units(this.options.fontSize);
        title.style.color = this.options.color;
        title.style.textTransform = "uppercase";
        title.style.fontWeight = "normal";
        title.style.fontFamily = this.options["font-family"];
        title.style.margin = 0;
        title.style.padding = 0;
        title.style.borderTop = "1px solid";
        title.style.borderTopColor = this.options.color;
        title.style.backgroundColor = this.options["title-background-color"];
        title.style.textShadow = "none";
        title.style.padding = this.options.elementPadding;

        //Create the list element.
        var list = document.createElement("ul");
        parentDiv.appendChild(list);

        //Create the loading node
        var loading = document.createElement("li");
        loading.innerHTML = "Loading...";

        //Put it in the list.
        list.appendChild(loading);

        //Place appropriate styles on it.
        list.style.lineHeight = title.style.height;
        list.style["font-size"] = (value(this.options.fontSize)) + units(this.options.fontSize);
        list.style.color = title.style.color;
        list.style.fontWeight = "bold";
        list.style.fontFamily = title.style.fontFamily;
        list.style.margin = 0;
        list.style.padding = 0;
        list.style.textShadow = "none";

        var drawIt = _.bind(function(response){
            this.data = response.result;
            if(this.data == null){
                this.data = 0;
            }

            if(this.data.length === 0) {
            	loading.innerHTML = "No Data";
            } else {
            	list.removeChild(loading);
            }

            //This if statement allows users to set sortField to false, and skip the whole sorting thing
            if(typeof(this.options.sortField) !== "undefined") {
            	var sortedData = [];
            	for(i = 0,imax=this.data.length; i<imax; i++) {
            		var curValue = this.data[i][this.options.sortField];
            		var inserted = false;
            		for(j = 0,jmax=sortedData.length; j<jmax; j++) {
            			if(curValue > sortedData[j][this.options.sortField]) {
            				sortedData.splice(j, 0, this.data[i]);
            				inserted = true;
            				break;
            			}
            		}

            		if(!inserted) {
            			sortedData.push(this.data[i]);
            		}
            	}

            	if(this.options.sortDirection == "asc") {
            		sortedData = sortedData.reverse();
            	}

            	this.data = sortedData;
            }

	        //Populate the list element
	        var max = typeof(this.options.maxElements) === "undefined" ? this.data.length : this.options.maxElements;
            for(var i=0; i<max; i++) {
            	var li = document.createElement("li");
            	li.innerHTML = this.options.prefix + this.data[i][this.options.labelField] + this.options.suffix;
            	li.style.padding = this.options.elementPadding;
            	li.style["border-bottom"] = "1px solid "+this.options["title-background-color"];
            	list.appendChild(li);
        	}

        }, this);

        if(_.isUndefined(response)){
            this.query.getResponse(drawIt);
        }
        else{
            drawIt(response);
        }
    };
}
