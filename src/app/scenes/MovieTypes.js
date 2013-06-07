function SceneMovieTypes() {
};

SceneMovieTypes.carousel = null;
SceneMovieTypes.carouselHandler = null;
SceneMovieTypes.isRotatingCarousel = false;
SceneMovieTypes.focusElements = [["back", "movietypes_focusElement_1"],
                               ["tv", "movietypes_focusElement_2"],
                               ["musk", "movietypes_focusElement_3"],
                               ["carousel", "movietypes_focusElement_4", "movietypes_focusElement_5"]];
SceneMovieTypes.movieTypesInfo = [];

SceneMovieTypes.currentFocusElementId = 3;


SceneMovieTypes.prototype.initialize = function () {
    alert("SceneMovieTypes.initialize()");
    
    //Parsing the xml and adding images to html page
    SceneMovieTypes.ParseXML("XML/MovieTypes_carousel.xml");
    
    SceneMovieTypes.updateFocusElements();
    
    SceneMovieTypes.updateTextFields();
};

SceneMovieTypes.updateTextFields = function() {
	var d = new Date();
	var n = d.getMonth();
	
	$("#month_name_movietypes").text(Languages["month"][n-1][AppData.language]);
	$("#movies_title_text").text(Languages["movies_title_text"][AppData.language]);
	$("#back_to_prev_menu_movietypes").text(Languages["back_to_prev_menu_movietypes"][AppData.language]);
	$("#home_to_main_menu_movietypes").text(Languages["home_to_main_menu_movietypes"][AppData.language]);
};


SceneMovieTypes.rotateCarousel = function() {
	
	if (SceneMovieTypes.isRotatingCarousel) 
	{
		SceneMovieTypes.carousel.shiftRight();
		
		SceneMovieTypes.carouselHandler = setTimeout(function() {
			SceneMovieTypes.rotateCarousel();
		}, Constants.carouselInterval);
	
		SceneMovieTypes.updateText();
	}
};

SceneMovieTypes.startRotatingCarousel = function() {
	SceneMovieTypes.isRotatingCarousel = true;
	
	SceneMovieTypes.carouselHandler = setTimeout(function() {
		SceneMovieTypes.rotateCarousel();
	}, Constants.carouselInterval);
};

SceneMovieTypes.stopRotatingCarousel = function() {
	SceneMovieTypes.isRotatingCarousel = false;
	
	clearTimeout(SceneMovieTypes.carouselHandler);
};

//Here we update the title text
SceneMovieTypes.updateText = function() {
	//$("#bottom_carousel_text").text(SceneMovieTypes.movieTypesInfo[SceneMovieTypes.carousel.currentLayer - 1]);
	
	var textId = SceneMovieTypes.movieTypesInfo[SceneMovieTypes.carousel.currentLayer - 1];
	document.getElementById("bottom_carousel_text").innerHTML = Languages[textId][AppData.language];
};

//This method hide all unfocused elements and shows the focused one
SceneMovieTypes.updateFocusElements = function() {
    for (var i = 0; i < SceneMovieTypes.focusElements.length; i++)
    {
    	if (i == SceneMovieTypes.currentFocusElementId)
    	{
    		$("#"+SceneMovieTypes.focusElements[i][1]).show();
    		if (SceneMovieTypes.focusElements[i][2])
    		{
    			$("#"+SceneMovieTypes.focusElements[i][2]).show();
    			//SceneMovieTypes.stopRotatingCarousel();
    		}
    	} else {
    		$("#"+SceneMovieTypes.focusElements[i][1]).hide();
    		
    		if (SceneMovieTypes.focusElements[i][2])
    		{
    			$("#"+SceneMovieTypes.focusElements[i][2]).hide();
    		}
    	}  	
    }
};


SceneMovieTypes.launchCarousel = function() {
	//Launching the carousel
	SceneMovieTypes.carousel = $("#carouselMT > *").rondell({
      preset: "carousel",
      size: {
    	  width: 1520,
          height: 530  
      },
      scaling: 1,
      itemProperties: {
    	  size: {
    		  width: 914,
    		  height: 514
       	  }
      },
      center: {
    	  left: 760,
    	  top: 265
      },
      radius: {
    	  x: 400
      },
      autoRotation: {
    	  enabled: false,
    	  delay: Constants.carouselInterval
      }
    }, function() {
    	$(".loaderImg").hide();
    });

	SceneMovieTypes.startRotatingCarousel();
	SceneMovieTypes.updateText();
	
};

SceneMovieTypes.ParseXML = function (xmlURL) {

    $.ajax({
        type: "get",
        dataType: "xml",
        url: xmlURL,
        success: function(xml){
            if($(xml).find("image").length > 0){
                $(xml).find("image").each(function(){ // loop
                	var src = $(this).attr("src");
                	
                	$("#carouselMT").append('<a rel="rondell_1" href="#"><img src="'+src+'" width="914" height="514" class="carouselImage"/></a>');
                    
                	SceneMovieTypes.movieTypesInfo.push([$(this).attr("id")]);
                });
            }
            
            SceneMovieTypes.launchCarousel();
        },
        error: function(){
            alert("xml error!!");
        }
    });
};

SceneMovieTypes.prototype.keyLeftPress = function() {
	var focusedId = SceneMovieTypes.currentFocusElementId;
	if (focusedId <= 2)
	{
		focusedId = focusedId == 0 ? 2 : focusedId - 1;
	} else {
		//Shift Carousel Left
		SceneMovieTypes.stopRotatingCarousel();
		SceneMovieTypes.carousel.shiftLeft();
		SceneMovieTypes.startRotatingCarousel();
		SceneMovieTypes.updateText();
	}
	SceneMovieTypes.currentFocusElementId = focusedId;
	SceneMovieTypes.updateFocusElements();	
};
SceneMovieTypes.prototype.keyRightPress = function() {
	var focusedId = SceneMovieTypes.currentFocusElementId;
	if (focusedId <= 2)
	{
		focusedId = focusedId == 2 ? 0 : focusedId + 1;
	} else {
		//Shift Carousel Right
		SceneMovieTypes.stopRotatingCarousel();
		SceneMovieTypes.carousel.shiftRight();
		SceneMovieTypes.startRotatingCarousel();
		SceneMovieTypes.updateText();
	}	
	SceneMovieTypes.currentFocusElementId = focusedId;
	SceneMovieTypes.updateFocusElements();
};
SceneMovieTypes.prototype.keyUpPress = function() {
	if (SceneMovieTypes.currentFocusElementId <= 2)
	{
		//Carousel
		SceneMovieTypes.currentFocusElementId = 3;
		//SceneMovieTypes.stopRotatingCarousel();
	} else {
		//Middle menu
		SceneMovieTypes.currentFocusElementId = 0;
		//SceneMovieTypes.startRotatingCarousel();
	}	
	SceneMovieTypes.updateFocusElements();
	
};
SceneMovieTypes.prototype.keyDownPress = function() {
	if (SceneMovieTypes.currentFocusElementId <= 2)
	{
		//Carousel
		SceneMovieTypes.currentFocusElementId = 3;
		//SceneMovieTypes.stopRotatingCarousel();
	} else {
		//Top menu
		SceneMovieTypes.currentFocusElementId = 0;
		//SceneMovieTypes.startRotatingCarousel();
	}	
	SceneMovieTypes.updateFocusElements();		
};
SceneMovieTypes.prototype.keyEnterPress = function() {
	
	switch (SceneMovieTypes.currentFocusElementId)
	{
		case 0:
			//go back
			Controller.changeScene(AppData.previousScreen);
			AppData.previousScreen = 'MovieTypes';
			break;
		case 1:
			//goto TV channels screen
			AppData.previousScreen = 'MovieTypes';
			Controller.changeScene('TVchannels');
			break;
		case 2:
			//goto Musik screen
			break;
		case 3:
			//Carousel - select video type
			AppData.previousScreen = 'MovieTypes';
			AppData.selectedItem = SceneMovieTypes.movieTypesInfo[SceneMovieTypes.carousel.currentLayer - 1];
			//alert(AppData.selectedItem);
			Controller.changeScene('Movies');
			break;
	}
};
SceneMovieTypes.prototype.keyHomePress = function() {
	Controller.changeScene('MainMenu');
};
SceneMovieTypes.prototype.keyBackPress = function() {
	this.keyReturnPress();
};
SceneMovieTypes.prototype.keyReturnPress = function() {
	if (AppData.previousScreen != null && AppData.previousScreen != "")
	{
		if (AppData.previousScreen != null && AppData.previousScreen != "")
		{
			//go back
			Controller.changeScene(AppData.previousScreen);
			AppData.previousScreen = 'MovieTypes';
		}
	}
};


SceneMovieTypes.prototype.handleKeyDown = function (keyCode) {
    alert("SceneMovieTypes.handleKeyDown(" + keyCode + ")");
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
	    case sf.key.RETURN:
	    	this.keyReturnPress();
	    	break;
    }
};

SceneMovieTypes.prototype.handleShow = function (data) {
    alert("SceneMovieTypes.handleShow()");
};

SceneMovieTypes.prototype.handleHide = function () {
    alert("SceneMovieTypes.handleHide()");
};

SceneMovieTypes.prototype.handleFocus = function () {
    alert("SceneMovieTypes.handleFocus()");
    
    if (SceneMovieTypes.carousel)
    	$(".loaderImg").hide();
};

SceneMovieTypes.prototype.handleBlur = function () {
    alert("SceneMovieTypes.handleBlur()");
};
