var Util = (function(){
	'use strict';
	var CONST = {
		FADE_CLASS: "faded",
		FADE_TIME: 501
	};
	var export = {};
	/*
	* Faded elements are rendered but not visible (opacity: 0)
	*/
	export.fadeOut = function(element, cb){
		element.classList.add(CONST.FADE_CLASS);
		setTimeout(function(){
			if(typeof cb == "function")
				cb();
		}, CONST.FADE_TIME);
	};


	/* 
	* Given a template id, replaces '{key}' with 'data.key'
	* and returns a clone
	*/
	export.inflateWith = function(templateId, data){
		var element = document.getElementById(templateId);
		var clone = element.cloneNode(true);
		clone.innerHTML = clone.innerHTML.replace(/\{(.+?)\}/g, function(full, label) { 
			return data[label]==null ?  "" : data[label];
		});

		return document.importNode(clone.content, true);
	};

	/*
	* Loads a file asynchronously
	* if succesfull calls cb(response), 
	* else calls cberr(statusText)
	*/
	export.loadFile = function (sURL, cb, cberr) {
		var oReq = new XMLHttpRequest();
		oReq.onload = function(){
			if (this.readyState === 4) {
				if (this.status === 200) {
					if(typeof cb == "function")
						cb(this.responseText);
				} else {
					if(typeof cb == "function")
						cberr(this.statusText);
				}
			}
		};
		oReq.onerror = function(){
			if(typeof cb == "function")
				cberr(this.statusText);
		};
		oReq.open("GET", sURL, true);
		oReq.timeout = CONST.REQ_TIMEOUT;
		oReq.send(null);
	};

	export.fadeIn = function(element, cb){
		element.classList.remove(CONST.FADE_CLASS);
		setTimeout(function(){
			if(typeof cb == "function")
				cb();
		}, CONST.FADE_TIME);
	};

	return export;
})();


//Requires Util
var Navigation = (function(Util){
	"use strict";
	/*
	* -Views are only visible if in 'active' state
	*
	* -add data-bind-view attribute to elements that change state
	* to 'selected' when a view is 'active'
	*/
	var CONST = {
		SELECTED_CLASS: "selected",
		ACTIVE_CLASS: "active",
		DEFAULT_VIEW: "home",
		ROW_CLASSES:[
			"first",
			"second",
			"third",
			"fourth",
			"fifth",
			"sixth"
		]
	};

	var views = {
		"home": "home",
		"team": "team",
		"sponsors": "sponsors",
		"press": "press",
		"team": "team",
		"about": "about"
	};

	//preShow has been executed on a view (key)
	var _initializedViews =[];

	//These functions are called before showView (only if defined)
	//This function is called only the first time visiting that route
	//Load async data / init view here
	//Call finished when ended 
	var preShowHooks = {
		sponsors: function(finished){
			Util.loadFile("assets/data/sponsors.json", function(data){
				var sponsors = JSON.parse(data);
				sponsors.forEach(function(sponsor){
					var element = Util.inflateWith("sponsorTemplate",sponsor);

					document.querySelector("#sponsors ."+CONST.ROW_CLASSES[sponsor.row-1])
						.appendChild(element);
				});
				finished();	
			});
			
		},
		press: function(finished){
			Util.loadFile("assets/data/press.json", function(data){
				var reports = JSON.parse(data);
				reports.forEach(function(reportrow){
					//var row = document.createElement("div");
					//row.classList.add("row");
					reportrow.forEach(function(report){
						var element = Util.inflateWith("reportTemplate",report);
						//row.appendChild(element);
						document.querySelector("#press .container")
							.appendChild(element);	
					});
					
					//document.querySelector("#press .container")
					//	.appendChild(row);
				});
				finished();	
			});
			
		},
		team: function(finished){
			Util.loadFile("assets/data/members.json", function(data){
				var members = JSON.parse(data);
				members.forEach(function(member){
					var element = Util.inflateWith("memberTemplate", member);
					document.querySelector("#team .container")
						.appendChild(element);
				});
				finished();	
			});
			
		}
	};


	//Sets 'selected' class in binded elements
	function updateBindings(newView){
		var elements = document.querySelectorAll("[data-bind-view]");
		for(var i = 0; i < elements.length; i++){
			if(elements[i].dataset.bindView == newView)
				elements[i].classList.add(CONST.SELECTED_CLASS);
			else
				elements[i].classList.remove(CONST.SELECTED_CLASS);
		}
	}

	//Changes the hash, which triggers a route change event
	function goTo(route){
		window.location.hash ="/"+route;
	}

	function preShowView(route){
		if(_initializedViews[route])
			showView(route);
		else
		{
			preShowHooks[route](function(){
				showView(route);
				_initializedViews[route] = true;
			});
			
		}
	}

	function onRouteChange(){
		if(window.location.hash && window.location.hash.indexOf("/") != -1){
			var route = window.location.hash.slice(window.location.hash.indexOf("/") + 1);
			if(!!views[route]){
				updateBindings(route);
				//If pre initizalization defined
				if(preShowHooks[route])
					preShowView(route);
				else
					showView(route);	
			}
			else{
				console.warn("View '"+ route +"' doesn't exist."+
					" Showing default ("+CONST.DEFAULT_VIEW+").");
				goTo(CONST.DEFAULT_VIEW);
			}
		}
		else{
			goTo(CONST.DEFAULT_VIEW);
		}

	}

	//scrollReveal triggers only when scrolled after
	//it has been hidden. Because of this, we scroll
	//to 0 and 1 alternatively every time we change screen
	var _last_scroll_pos = 0;
	function changeView(view){
		var viewElements = document.querySelectorAll(".view");
		for(var i = 0; i < viewElements.length; i++){
			viewElements[i].classList.remove(CONST.ACTIVE_CLASS);
		}
		document.getElementById(view).classList.add(CONST.ACTIVE_CLASS);
		
		//hack
		_last_scroll_pos = !_last_scroll_pos;
		window.scrollTo(0, _last_scroll_pos);
		
	}


	function showView(view){
		var main = document.querySelector("main");
		Util.fadeOut(main, function(){
			changeView(view);
			Util.fadeIn(main);	
		});
	}
	var export = {};
	export.goTo = goTo;
	export.onRouteChange = onRouteChange;

	return export;
})(Util);

//Requires Navigation
(function(Navigation, Util){
	"use strict";
	//How long takes to chanage imagine text
	var CITY_LOOP_DELAY = 5000;
	//Values used in the imagine text
	var cities =
	[
		{
			from: "Stockholm",
			to: "Oslo",
			in: "30 mins"
		},
		{
			from: "Los Angeles",
			to: "San Francisco",
			in: "30 mins"
		},
		{
			from: "London",
			to: "Manchester",
			in: "15 mins"
		},
		{
			from: "Toronto",
			to: "Montreal",
			in: "27 mins"
		}
	];
	//Strings in braces will be replaced
	var loopBaseString = 
		"...a world where you could\n "
		+ "travel from {from}\n"
		+ "to {to} in\n"
		+ "{in}.";

	function initScrollReveal(){
		window.sr = ScrollReveal({
		  viewFactor: 1,
		  duration:1000
		});

		sr.reveal('#home .first',{
			delay: 2000,
			beforeReveal:function(){
				setTimeout(function(){
					document.getElementById("firstLine").classList.add("expand");
					
				}, 1600);
			},
			afterReveal:function(){
				setTimeout(function(){
					document.getElementById("imagineText").classList.remove("invisible");
					initCityLoop();
					
				}, 600);	
			}
		});
		sr.reveal('#home .second', {
			delay: 4500,
			beforeReveal:function(){
				setTimeout(function(){
					document.getElementById("secondLine").classList.add("expand");
					
				}, 4000);
			},
			afterReveal: function(){
				setTimeout(function(){
					document.getElementById("thirdLine").classList.add("expand");
					
				}, 2000);
			}
		});
		sr.reveal('#home .third', {
			viewFactor: 0.2
		});
		sr.reveal('#home .fourth', {
			delay: 500,
			beforeReveal: function(){
				document.getElementById("fourthLine").classList.add("expand");
			},
			afterReveal: function(){
				setTimeout(function(){
					document.getElementById("sixthLine").classList.add("expand");	
				}, 2000);
			}
		});
		sr.reveal('#home .fifth', {
			delay:1000,
			viewFactor: 0.5,
			beforeReveal: function(){
				document.getElementById("fifthLine").classList.add("expand");
			}
		});
		sr.reveal('#home .sixth',{
			viewFactor: 0.2
		});
		sr.reveal('#home .seventh',{
			viewFactor: 0.5,
			delay:1000,
			beforeReveal:function(){
				document.getElementById("seventhLine").classList.add("expand");	
			}
		});
		sr.reveal('#home .eighth', {
			viewFactor: 0.5,
			delay: 2000,
			beforeReveal: function(){
				document.getElementById("eighthLine").classList.add("expand");
				document.getElementById("ninethLine").classList.add("expand");
			}
		});
		sr.reveal('#home .conclusion',{
			viewFactor:0.5,
			delay:3000
		});
		sr.reveal('#sponsors .row', {
			viewFactor:0.4
		});
	}

	function initCityLoop(){
		var currentCity = 0;
		var textElem = document.getElementById("imagineText");
		setInterval(function(){
			//Next city
			currentCity = (currentCity+1) % cities.length;
			//Hide text
			textElem.classList.add("invisible");
			//Wait transition to finish
			setTimeout(function(){
				var aux = loopBaseString;
				for (var key in cities[currentCity]) {
					if (cities[currentCity].hasOwnProperty(key)) {
						aux = aux.replace(
							"{"+key+"}", 
							cities[currentCity][key]
						);
					}
				}
				textElem.innerHTML = aux;

				textElem.classList.remove("invisible");
			}, 500);
		}, CITY_LOOP_DELAY);
	}

	document.addEventListener("DOMContentLoaded", function(){
		initScrollReveal();
		window.addEventListener("hashchange", Navigation.onRouteChange);
		//Set current view
		Navigation.onRouteChange();
		setTimeout(function(){
			window.scrollTo(0, 2);
		},100);


		//newsletter prompt
		document.getElementById("closeNewsletter").addEventListener("click",function(){
			Util.fadeOut(document.getElementById("newsletterPrompt"));
		});
		setTimeout(function(){
			Util.fadeIn(document.getElementById("newsletterPrompt"));
		}, 5000);
	});	
})(Navigation, Util);
