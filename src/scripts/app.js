document.addEventListener("DOMContentLoaded", function(){
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
});