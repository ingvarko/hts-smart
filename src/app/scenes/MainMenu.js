function SceneMainMenu() {
};

SceneMainMenu.isVideoPlaying = false;
SceneMainMenu.isVideoOnPause = false;


//This variable will control no activity and redirecting to main menu
SceneMainMenu.activityHandler = null;
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

//Play/Pause video
SceneMainMenu.playPauseVideo = function() {
	if (SceneMainMenu.isVideoPlaying) {
		if (SceneMainMenu.isVideoOnPause) {
			sf.service.VideoPlayer.resume();
			SceneMainMenu.isVideoOnPause = false;
		} else {
			sf.service.VideoPlayer.pause();
			SceneMainMenu.isVideoOnPause = true;
		}
	}
};

// Stop playing video (custom stop or the video ended).
SceneMainMenu.stopVideo = function() {
	if (SceneMainMenu.isVideoPlaying) {
		SceneMainMenu.isVideoPlaying = false;

		sf.service.VideoPlayer.stop();

		sf.service.VideoPlayer.hide();
	}

	// video is over, we can continue playing bg music
	var player = document.getElementById("flvplayer");
	if (player)
		$(player).show();
};

// User clicked Enter on the movie - no way out, let's play it :)
SceneMainMenu.playVideo = function() {

	// first we have to stop playing bg music
	var player = document.getElementById("flvplayer");
	if (player)
		$(player).hide();

	SceneMainMenu.isVideoPlaying = true;

	sf.service.VideoPlayer.setZIndex(100005);

	sf.service.VideoPlayer.init({
		onend : function() {
			alert('Video ended.');
			SceneMainMenu.stopVideo();
		},
		onerror : function(error) {
			alert('Error : ' + error);
			SceneMainMenu.stopVideo();
		}
	});

	sf.service.VideoPlayer.setPosition({
		left : 0,
		top : 0,
		width : 1920,
		height : 1080
	});

	// TODO:Sets Player as fullscreen mode - do that when testing on real device
	// sf.service.VideoPlayer.setFullScreen(true);

	var url = "http://clips.vorwaerts-gmbh.de/big_buck_bunny.mp4";
	// SceneMainMenu.moviesInfo[]

	if (url) {
		// starts playback
		sf.service.VideoPlayer.play({
			url : url,
			fullScreen : false
		});
	}
};


SceneMainMenu.setActivityControl = function() {
	clearTimeout(SceneMainMenu.activityHandler);
	
	SceneMainMenu.activityHandler = setTimeout(function() {
		Controller.changeScene('HomePage');
	}, Constants.noActivityTime);
};

SceneMainMenu.updateTextFields = function() {
	var d = new Date();
	var n = d.getMonth();
	
	$("#language_text_label_mainmenu").text(Languages["langTexts"][AppData.language]);
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
	if (SceneMainMenu.currentFocusElementId == 7)
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
    	  enabled: false,
    	  delay: Constants.carouselInterval
      }
    }, function() {
    	$(".loaderImg").hide();
    });

	SceneMainMenu.startRotatingCarousel();
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
		
		SceneMainMenu.saveLanguage();
	}
	
	SceneMainMenu.hideLanguageMenu();
};

//We write language value to Saves.data file (sort of cookies) 
SceneMainMenu.saveLanguage = function() {
	var fs = new FileSystem();
	var keyFile = fs.openCommonFile('Saves.data', 'w');
	keyFile.writeAll("lang:" + AppData.language);
    fs.closeCommonFile(keyFile);
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
	
	if (SceneMainMenu.currentFocusElementId <= 2)
	{
		//Carousel
		SceneMainMenu.currentFocusElementId = 7;
		SceneMainMenu.stopRotatingCarousel();
	} else if (SceneMainMenu.currentFocusElementId <= 6) {
		//Top menu
		SceneMainMenu.currentFocusElementId = 0;
	} else {
		//Middle menu
		SceneMainMenu.currentFocusElementId = 3;
		SceneMainMenu.startRotatingCarousel();
	}
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
	
	if (SceneMainMenu.currentFocusElementId <= 2)
	{
		//MiddleMenu
		SceneMainMenu.currentFocusElementId = 3;
	} else if (SceneMainMenu.currentFocusElementId <= 6) {
		//Carousel
		SceneMainMenu.currentFocusElementId = 7;
		SceneMainMenu.stopRotatingCarousel();
	} else {
		//Top menu
		SceneMainMenu.currentFocusElementId = 0;
		SceneMainMenu.startRotatingCarousel();
	}
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
			SceneMainMenu.playVideo();
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
        	SceneMainMenu.setActivityControl();
        	this.keyLeftPress();
            break;
        case sf.key.RIGHT:
        	SceneMainMenu.setActivityControl();
        	this.keyRightPress();
            break;
        case sf.key.UP:
        	SceneMainMenu.setActivityControl();
        	this.keyUpPress();
            break;
        case sf.key.DOWN:
        	SceneMainMenu.setActivityControl();
        	this.keyDownPress();
            break;
        case sf.key.ENTER:
        	SceneMainMenu.setActivityControl();
        	this.keyEnterPress();
            break;
        case sf.key.BACK:
        	SceneMainMenu.setActivityControl();
        	this.keyBackPress();
        	break;
    }
};

SceneMainMenu.prototype.handleShow = function (data) {
    alert("SceneServices.handleShow()");
};

SceneMainMenu.prototype.handleHide = function () {
    alert("SceneServices.handleHide()");
    SceneMainMenu.activityHandler = null;
};

SceneMainMenu.prototype.handleFocus = function () {
    alert("SceneServices.handleFocus()");
    SceneMainMenu.setActivityControl();
    
    if (SceneMainMenu.carousel)
    	$(".loaderImg").hide();    
};

SceneMainMenu.prototype.handleBlur = function () {
    alert("SceneServices.handleBlur()");
};
