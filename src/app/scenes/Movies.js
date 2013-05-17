function SceneMovies() {
};

SceneMovies.carousel = null;
SceneMovies.isRotatingCarousel = false;
SceneMovies.focusElements = [["back", "movies_focusElement_1"],
                                 ["tv", "movies_focusElement_2"],
                                 ["musik", "movies_focusElement_3"],
                                 ["carousel", "movies_focusElement_4", "movies_focusElement_5"]];
SceneMovies.moviesInfo = [];
SceneMovies.currentFocusElementId = 0;


SceneMovies.prototype.initialize = function () {
    alert("SceneMovies.initialize()");
    
    //Parsing the xml and adding images to html page
    SceneMovies.ParseXML("XML/Movies_carousel.xml");
    
    SceneMovies.updateFocusElements();
    
    SceneMovies.updateTextFields();
};

SceneMovies.updateTextFields = function() {
	var d = new Date();
	var n = d.getMonth();
	
	$("#month_name_movies").text(Languages["month"][n-1][AppData.language]);
	$("#movies_category_title_text").text(Languages[AppData.selectedItem][AppData.language]);
	$("#back_to_prev_menu_movies").text(Languages["back_to_prev_menu_movietypes"][AppData.language]);
	$("#home_to_main_menu_movies").text(Languages["home_to_main_menu_movietypes"][AppData.language]);
};


SceneMovies.rotateCarousel = function() {
	
	if (SceneMovies.isRotatingCarousel) 
	{
		SceneMovies.carousel.shiftRight();
		
		setTimeout(function() {
			SceneMovies.rotateCarousel();
		}, Constants.carouselInterval);
	
		SceneMovies.updateText();
	}
};

SceneMovies.startRotatingCarousel = function() {
	if (SceneMovies.currentFocusElementId == 3)
		return;
	
	SceneMovies.isRotatingCarousel = true;
	
	setTimeout(function() {
		SceneMovies.rotateCarousel();
	}, Constants.carouselInterval);
};

SceneMovies.stopRotatingCarousel = function() {
	SceneMovies.isRotatingCarousel = false;
};

//Here we update the title text
SceneMovies.updateText = function() {
	//$("#bottom_carousel_text").text(SceneMovies.movieTypesInfo[SceneMovies.carousel.currentLayer - 1]);
	
	var textId = SceneMovies.moviesInfo[SceneMovies.carousel.currentLayer - 1];
	document.getElementById("movie_name_text").innerHTML = Languages[textId][AppData.language];
	document.getElementById("movie_description_text").innerHTML = Languages[textId+"_desc"][AppData.language];
};

//This method hide all unfocused elements and shows the focused one
SceneMovies.updateFocusElements = function() {
    for (var i = 0; i < SceneMovies.focusElements.length; i++)
    {
    	if (i == SceneMovies.currentFocusElementId)
    	{
    		$("#"+SceneMovies.focusElements[i][1]).show();
    		if (SceneMovies.focusElements[i][2])
    		{
    			$("#"+SceneMovies.focusElements[i][2]).show();
    			SceneMovies.stopRotatingCarousel();
    		}
    	} else {
    		$("#"+SceneMovies.focusElements[i][1]).hide();
    		
    		if (SceneMovies.focusElements[i][2])
    		{
    			$("#"+SceneMovies.focusElements[i][2]).hide();
    		}
    	}  	
    }
};


SceneMovies.launchCarousel = function() {
	SceneMovies.carousel = null;
	//Launcing the carousel
	SceneMovies.carousel = $("#carouselM > *").rondell({
      preset: "carousel",
      size: {
    	  width: 1220,
          height: 448  
      },
      scaling: 1.5,
      itemProperties: {
    	  size: {
    		  width: 531,
    		  height: 297
       	  }
      },
      center: {
    	  left: 610,
    	  top: 224
      },
      radius: {
    	  x: 300
      },
      visibleItems: 2,
      autoRotation: {
    	  enabled: false
      }
    });

	SceneMovies.startRotatingCarousel();
	SceneMovies.updateText();
	
	$(".loaderImg").hide();
};

SceneMovies.ParseXML = function (xmlURL) {

	$("#carouselM").text("");
	SceneMovies.moviesInfo = [];
	
    $.ajax({
        type: "get",
        dataType: "xml",
        url: xmlURL,
        success: function(xml){
        	$(xml).find("images").each(function(){ // loop
        		if ($(this).attr("categoryId") == AppData.selectedItem) {
		            if($(this).find("image").length > 0){
		
		                $(this).find("image").each(function(){ // loop
		                	var src = $(this).attr("src");
		                	
		                	
		                	$("#carouselM").append('<a rel="rondell_1" href="#"><img src="'+src+'" width="914" height="514" class="carouselImage"/></a>');
		                    
		                	SceneMovies.moviesInfo.push([$(this).attr("id")]);
		                });
		            }
        		}
        	});
            
            SceneMovies.launchCarousel();
        },
        error: function(){
            alert("xml error!!");
        }
    });
};

SceneMovies.prototype.keyLeftPress = function() {
	var focusedId = SceneMovies.currentFocusElementId;
	if (focusedId <= 2)
	{
		focusedId = focusedId == 0 ? 2 : focusedId - 1;
	} else {
		//Shift Carousel Left
		SceneMovies.carousel.shiftLeft();
		SceneMovies.updateText();
	}
	SceneMovies.currentFocusElementId = focusedId;
	SceneMovies.updateFocusElements();	
};
SceneMovies.prototype.keyRightPress = function() {
	var focusedId = SceneMovies.currentFocusElementId;
	if (focusedId <= 2)
	{
		focusedId = focusedId == 2 ? 0 : focusedId + 1;
	} else {
		//Shift Carousel Right
		SceneMovies.carousel.shiftRight();
		SceneMovies.updateText();
	}	
	SceneMovies.currentFocusElementId = focusedId;
	SceneMovies.updateFocusElements();
};
SceneMovies.prototype.keyUpPress = function() {
	if (SceneMovies.currentFocusElementId <= 2)
	{
		//Carousel
		SceneMovies.currentFocusElementId = 3;
		SceneMovies.stopRotatingCarousel();
	} else {
		//Middle menu
		SceneMovies.currentFocusElementId = 0;
		SceneMovies.startRotatingCarousel();
	}	
	SceneMovies.updateFocusElements();
	
};
SceneMovies.prototype.keyDownPress = function() {
	if (SceneMovies.currentFocusElementId <= 2)
	{
		//Carousel
		SceneMovies.currentFocusElementId = 3;
		SceneMovies.stopRotatingCarousel();
	} else {
		//Top menu
		SceneMovies.currentFocusElementId = 0;
		SceneMovies.startRotatingCarousel();
	}	
	SceneMovies.updateFocusElements();		
};
SceneMovies.prototype.keyEnterPress = function() {
	
	switch (SceneMovies.currentFocusElementId)
	{
		case 0:
			//go back
			AppData.previousScreen = 'Movies';
			Controller.changeScene(AppData.previousScreen);
			break;
		case 1:
			//goto TV channels screen
			AppData.previousScreen = 'Movies';
			Controller.changeScene('TVchannels');
			break;
		case 2:
			//goto Musik screen
			break;
		case 3:
			//Carousel - select video to play
			//AppData.selectedItem = SceneMovies.movieTypesInfo[SceneMovies.carousel.currentLayer - 1];
			//play video
			break;
	}
};
SceneMovies.prototype.keyHomePress = function() {
	Controller.changeScene('MainMenu');
};
SceneMovies.prototype.keyBackPress = function() {
	//go back
	AppData.previousScreen = 'Movies';
	Controller.changeScene(AppData.previousScreen);
};



SceneMovies.prototype.handleKeyDown = function (keyCode) {
    alert("SceneMovies.handleKeyDown(" + keyCode + ")");
    switch (keyCode) {
	    case sf.key.LEFT:
	    	this.keyLeftPress();
	        break;
	    case sf.key.RIGHT:
	    	this.keyRightPress();
	        break;
	    case sf.key.UP:
	    	this.keyUpPress();
	        break;
	    case sf.key.DOWN:
	    	this.keyDownPress();
	        break;
	    case sf.key.ENTER:
	    	this.keyEnterPress();
	        break;
	    case sf.key.BACK:
	    	this.keyBackPress();
	    	break;
	    case sf.key.HOME:
	    	this.keyHomePress();
	    	break;
    }
};
SceneMovies.prototype.handleShow = function (data) {
    alert("SceneMovies.handleShow()");
};

SceneMovies.prototype.handleHide = function () {
    alert("SceneMovies.handleHide()");
};

SceneMovies.prototype.handleFocus = function () {
    alert("SceneMovies.handleFocus()");
    if (SceneMovies.carousel)
    {
        //Parsing the xml and adding images to html page
        SceneMovies.ParseXML("XML/Movies_carousel.xml");
        
        SceneMovies.updateFocusElements();
        
        SceneMovies.updateTextFields();
	
    }
};

SceneMovies.prototype.handleBlur = function () {
    alert("SceneMovies.handleBlur()");
};
