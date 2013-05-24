function SceneMainMenu() {
};

SceneMainMenu.isLangMenuShown = false;
SceneMainMenu.currentLangSelector = null;
SceneMainMenu.carousel = null;
SceneMainMenu.isRotatingCarousel = false;
SceneMainMenu.focusElements = [["info", "mainmenu_focusElement_1"],
                               ["demoVideo", "mainmenu_focusElement_2"],
                               ["language", "mainmenu_focusElement_3"],
                               ["tv", "mainmenu_focusElement_4"],
                               ["media", "mainmenu_focusElement_5"],
                               ["musik", "mainmenu_focusElement_6"],
                               ["services", "mainmenu_focusElement_7"],
                               ["carousel", "mainmenu_focusElement_8", "mainmenu_focusElement_9"]];

SceneMainMenu.currentFocusElementId = 3;

SceneMainMenu.prototype.initialize = function () {
    alert("SceneServices.initialize()");
    
    SceneMainMenu.ParseXML("XML/MainMenu_carousel.xml");
    
    SceneMainMenu.updateFocusElements();
    
    SceneMainMenu.updateTextFields();
};

SceneMainMenu.updateTextFields = function() {
	var d = new Date();
	var n = d.getMonth();
	
	$("#language_text_label").text(Languages["langTexts"][AppData.language]);
	$("#month_name_mainmenu").text(Languages["month"][n-1][AppData.language]);
	$("#check_out_services").text(Languages["check_out_services"][AppData.language]);
};


SceneMainMenu.rotateCarousel = function() {
	
	if (SceneMainMenu.isRotatingCarousel) 
	{
		SceneMainMenu.carousel.shiftRight();
		
		setTimeout(function() {
			SceneMainMenu.rotateCarousel();
		}, Constants.carouselInterval);
	
	}
};

SceneMainMenu.startRotatingCarousel = function() {
	if (SceneMainMenu.currentFocusElementId == 3)
		return;

	SceneMainMenu.isRotatingCarousel = true;
	
	setTimeout(function() {
		SceneMainMenu.rotateCarousel();
	}, Constants.carouselInterval);
};

SceneMainMenu.stopRotatingCarousel = function() {
	SceneMainMenu.isRotatingCarousel = false;
};

//This method hide all unfocused elements and shows the focused one
SceneMainMenu.updateFocusElements = function() {
    for (var i = 0; i < SceneMainMenu.focusElements.length; i++)
    {
    	if (i == SceneMainMenu.currentFocusElementId)
    	{
    		$("#"+SceneMainMenu.focusElements[i][1]).show();
    		if (SceneMainMenu.focusElements[i][2])
    		{
    			$("#"+SceneMainMenu.focusElements[i][2]).show();
    			SceneMainMenu.stopRotatingCarousel();
    		}
    	} else {
    		$("#"+SceneMainMenu.focusElements[i][1]).hide();
    		
    		if (SceneMainMenu.focusElements[i][2])
    		{
    			$("#"+SceneMainMenu.focusElements[i][2]).hide();
    		}
    	}  	
    }
};

SceneMainMenu.launchCarousel = function() {
	//Launcing the carousel
	alert('Launching carousel from MainMenu-------------------------');
	SceneMainMenu.carousel = $("#carouselSrv > *").rondell({
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
    	  enabled: false
      }
    });

	SceneMainMenu.startRotatingCarousel();
	
	$(".loaderImg").hide();
};

SceneMainMenu.ParseXML = function (xmlURL) {

    $.ajax({
        type: "get",
        dataType: "xml",
        url: xmlURL,
        success: function(xml){
            if($(xml).find("image").length > 0){
                $(xml).find("image").each(function(){ // loop
                	var src = $(this).attr("src");
                	
                	$("#carouselSrv").append('<a rel="rondell_1" href="#"><img src="'+src+'" width="914" height="514" class="carouselImage"/></a>');
                    
                });
            }
            
            SceneMainMenu.launchCarousel();
        },
        error: function(){
            alert("xml error!!");
        }
    });
};

SceneMainMenu.updateLangMenuView = function() {
	document.getElementById("active_line_main_menu").style.top = Constants.langMenuSelector[SceneMainMenu.currentLangSelector] + 'px';
	document.getElementById("selected_lang_main_menu").style.top = Constants.langMenuActive[AppData.language] + 'px';		
};

SceneMainMenu.showLanguageMenu = function() {
	SceneMainMenu.isLangMenuShown = true;
	SceneMainMenu.currentLangSelector = AppData.language;
	
	SceneMainMenu.updateLangMenuView();

	$("#language_menu_mainmenu").fadeIn('fast');
};

SceneMainMenu.hideLanguageMenu = function() {
	SceneMainMenu.isLangMenuShown = false;
	
	$("#language_menu_mainmenu").fadeOut('fast');
};

SceneMainMenu.setLanguage = function() {
	
	if (SceneMainMenu.currentLangSelector != AppData.language)
	{
		AppData.language = SceneMainMenu.currentLangSelector; 
		SceneMainMenu.updateTextFields();
	}
	
	SceneMainMenu.hideLanguageMenu();
};

SceneMainMenu.prototype.keyLeftPress = function() {
	if (SceneMainMenu.isLangMenuShown)
	{
		return;
	}
	
	var focusedId = SceneMainMenu.currentFocusElementId;
	if (focusedId <= 2)
	{
		focusedId = focusedId == 0 ? 2 : focusedId - 1;
	} else if (focusedId <= 6) {
		focusedId = focusedId == 3 ? 6 : focusedId - 1;
	} else {
		//Shift Carousel Left
		SceneMainMenu.carousel.shiftLeft();
	}
	SceneMainMenu.currentFocusElementId = focusedId;
	SceneMainMenu.updateFocusElements();	
};
SceneMainMenu.prototype.keyRightPress = function() {
	if (SceneMainMenu.isLangMenuShown)
	{
		return;
	}

	var focusedId = SceneMainMenu.currentFocusElementId;
	if (focusedId <= 2)
	{
		focusedId = focusedId == 2 ? 0 : focusedId + 1;
	} else if (focusedId <= 6) {
		focusedId = focusedId == 6 ? 3 : focusedId + 1;
	} else {
		//Shift Carousel Right
		SceneMainMenu.carousel.shiftRight();
	}	
	SceneMainMenu.currentFocusElementId = focusedId;
	SceneMainMenu.updateFocusElements();
};
SceneMainMenu.prototype.keyUpPress = function() {
	
	if (SceneMainMenu.isLangMenuShown)
	{
		SceneMainMenu.currentLangSelector--;
		if (SceneMainMenu.currentLangSelector == -1)
			SceneMainMenu.currentLangSelector = 2;
		
		SceneMainMenu.updateLangMenuView();
		
		return;
	}
	
	var focusedId = SceneMainMenu.currentFocusElementId;
	if (focusedId <= 2)
	{
		//Carousel
		focusedId = 7;
		SceneMainMenu.stopRotatingCarousel();
	} else if (focusedId <= 6) {
		//Top menu
		focusedId = 0;
	} else {
		//Middle menu
		focusedId = 3;
		SceneMainMenu.startRotatingCarousel();
	}	
	SceneMainMenu.currentFocusElementId = focusedId;
	SceneMainMenu.updateFocusElements();
	
};
SceneMainMenu.prototype.keyDownPress = function() {
	
	if (SceneMainMenu.isLangMenuShown)
	{
		SceneMainMenu.currentLangSelector++;
		if (SceneMainMenu.currentLangSelector == 3)
			SceneMainMenu.currentLangSelector = 0;
		
		SceneMainMenu.updateLangMenuView();
		
		return;
	}
	
	var focusedId = SceneMainMenu.currentFocusElementId;
	if (focusedId <= 2)
	{
		//MiddleMenu
		focusedId = 3;
	} else if (focusedId <= 6) {
		//Carousel
		focusedId = 7;
		SceneMainMenu.stopRotatingCarousel();
	} else {
		//Top menu
		focusedId = 0;
		SceneMainMenu.startRotatingCarousel();
	}	
	SceneMainMenu.currentFocusElementId = focusedId;
	SceneMainMenu.updateFocusElements();		
};
SceneMainMenu.prototype.keyEnterPress = function() {
	
	switch (SceneMainMenu.currentFocusElementId)
	{
		case 0:
			//Do smth
			break;
		case 1:
			//Play demo video
			break;
		case 2:
			//Show language menu
			if (!SceneMainMenu.isLangMenuShown)
				SceneMainMenu.showLanguageMenu();
			else 
				SceneMainMenu.setLanguage();
			break;
		case 3:
			//goto TV channels screen
			AppData.previousScreen = 'MainMenu';
			Controller.changeScene('TVchannels');
			break;
		case 4:
			//goto Media screen
			AppData.previousScreen = 'MainMenu';
			Controller.changeScene('MovieTypes');
			break;
		case 5:
			//goto Musik screen
			break;
		case 6:
			//goto Services screen
			break;
		case 7:
			//goto active Screen on carousel 
			break;
	}
};
SceneMainMenu.prototype.keyBackPress = function() {
	if (SceneMainMenu.isLangMenuShown)
		SceneMainMenu.hideLanguageMenu();
};
SceneMainMenu.prototype.handleKeyDown = function (keyCode) {
    alert("SceneMainMenu.handleKeyDown(" + keyCode + ")");
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
    }
};

SceneMainMenu.prototype.handleShow = function (data) {
    alert("SceneServices.handleShow()");
};

SceneMainMenu.prototype.handleHide = function () {
    alert("SceneServices.handleHide()");
};

SceneMainMenu.prototype.handleFocus = function () {
    alert("SceneServices.handleFocus()");
};

SceneMainMenu.prototype.handleBlur = function () {
    alert("SceneServices.handleBlur()");
};
