(function(){
	"use strict";
	//How long takes to chanage imagine text
	var CITY_LOOP_DELAY = 5000;
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
	});	
})();
