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
		DEFAULT_VIEW: "home"
	};

	var views = {
		"home": "home",
		"team": "team",
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

	function onRouteChange(){
		if(window.location.hash && window.location.hash.indexOf("/") != -1){
			var route = window.location.hash.slice(window.location.hash.indexOf("/") + 1);
			if(!!views[route]){
				updateBindings(route);
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

	function changeView(view){
		var viewElements = document.querySelectorAll(".view");
		for(var i = 0; i < viewElements.length; i++){
			viewElements[i].classList.remove(CONST.ACTIVE_CLASS);
		}
		window.scrollTo(1,1);
		document.getElementById(view).classList.add(CONST.ACTIVE_CLASS);
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
(function(Navigation){
	"use strict";
	//How long takes to chanage imagine text
	var CITY_LOOP_DELAY = 3500;
	//Values used in the imagine text
	var cities =
	[
		{
			from: "Sweden",
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

		sr.reveal('.first',{
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
		sr.reveal('.second', {
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
		sr.reveal('.third', {
			viewFactor: 0.2
		});
		sr.reveal('.fourth', {
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
		sr.reveal('.fifth', {
			delay:1000,
			viewFactor: 0.5,
			beforeReveal: function(){
				document.getElementById("fifthLine").classList.add("expand");
			}
		});
		sr.reveal('.sixth',{
			viewFactor: 0.2
		});
		sr.reveal('.seventh',{
			viewFactor: 0.5,
			delay:1000,
			beforeReveal:function(){
				document.getElementById("seventhLine").classList.add("expand");	
			}
		});
		sr.reveal('.eighth', {
			viewFactor: 0.5,
			delay: 2000,
			beforeReveal: function(){
				document.getElementById("eighthLine").classList.add("expand");
				document.getElementById("ninethLine").classList.add("expand");
			}
		});
		sr.reveal('.conclusion',{
			viewFactor:0.5,
			delay:3000
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
	});	
})(Navigation);
