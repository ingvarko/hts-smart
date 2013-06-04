function SceneHomePage() {
};

SceneHomePage.isVideoPlaying = false;
SceneHomePage.isVideoOnPause = false;


SceneHomePage.pluginAPI = new Common.API.Plugin();
SceneHomePage.pluginAudio = null;
SceneHomePage.player = null;

SceneHomePage.isLangMenuShown = false;
SceneHomePage.currentLangSelector = null;
SceneHomePage.carousel = null;
SceneHomePage.isRotatingCarousel = false;
SceneHomePage.focusElements = [["info", "homepage_focusElement_1"],
                               ["demoVideo", "homepage_focusElement_2"],
                               ["language", "homepage_focusElement_3"],
                               ["carousel", "homepage_focusElement_4", "homepage_focusElement_5"]];

SceneHomePage.currentFocusElementId = 3;

SceneHomePage.prototype.initialize = function () {
    alert("SceneHP.initialize()");
    
    //Parsing the xml and adding images to html page
    SceneHomePage.ParseXML("XML/HomePage_carousel.xml");
    
    SceneHomePage.updateFocusElements();
    
    SceneHomePage.updateTextFields();
    
	/*sf.key.registerKey(sf.key.VOL_UP);
	sf.key.registerKey(sf.key.VOL_DOWN);
	sf.key.registerKey(sf.key.MUTE);*/
};

//Play/Pause video
SceneHomePage.playPauseVideo = function() {
	if (SceneHomePage.isVideoPlaying) {
		if (SceneHomePage.isVideoOnPause) {
			sf.service.VideoPlayer.resume();
			SceneHomePage.isVideoOnPause = false;
		} else {
			sf.service.VideoPlayer.pause();
			SceneHomePage.isVideoOnPause = true;
		}
	}
};

// Stop playing video (custom stop or the video ended).
SceneHomePage.stopVideo = function() {
	if (SceneHomePage.isVideoPlaying) {
		SceneHomePage.isVideoPlaying = false;

		sf.service.VideoPlayer.stop();

		sf.service.VideoPlayer.hide();
	}

	// video is over, we can continue playing bg music
	var player = document.getElementById("flvplayer");
	if (player)
		$(player).show();
};

// User clicked Enter on the movie - no way out, let's play it :)
SceneHomePage.playVideo = function() {

	// first we have to stop playing bg music
	var player = document.getElementById("flvplayer");
	if (player)
		$(player).hide();

	SceneHomePage.isVideoPlaying = true;

	sf.service.VideoPlayer.setZIndex(100005);

	sf.service.VideoPlayer.init({
		onend : function() {
			alert('Video ended.');
			SceneHomePage.stopVideo();
		},
		onerror : function(error) {
			alert('Error : ' + error);
			SceneHomePage.stopVideo();
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
	// SceneHomePage.moviesInfo[]

	if (url) {
		// starts playback
		sf.service.VideoPlayer.play({
			url : url,
			fullScreen : false
		});
	}
};


SceneHomePage.updateTextFields = function() {
	var d = new Date();
	var n = d.getMonth();
	
	$("#language_text_label_homemenu").text(Languages["langTexts"][AppData.language]);
	$("#month_name").text(Languages["month"][n-1][AppData.language]);
	$("#hotel_name_text").text(Languages["hotel_name_text"][AppData.language]);
	$("#hotel_welcome_msg_text").text(Languages["hotel_welcome_msg_text"][AppData.language]);
	$("#press_enter_text").text(Languages["press_enter_text"][AppData.language]);
};

SceneHomePage.rotateCarousel = function() {
	
	if (SceneHomePage.isRotatingCarousel) 
	{
		SceneHomePage.carousel.shiftRight();
		
		setTimeout(function() {
			SceneHomePage.rotateCarousel();
		}, Constants.carouselInterval);
	
	}
};

SceneHomePage.startRotatingCarousel = function() {
	if (SceneHomePage.currentFocusElementId == 7)
		return;

	SceneHomePage.isRotatingCarousel = true;
	
	setTimeout(function() {
		SceneHomePage.rotateCarousel();
	}, Constants.carouselInterval);
};

SceneHomePage.stopRotatingCarousel = function() {
	SceneHomePage.isRotatingCarousel = false;
};

//This method hide all unfocused elements and shows the focused one
SceneHomePage.updateFocusElements = function() {
    for (var i = 0; i < SceneHomePage.focusElements.length; i++)
    {
    	if (i == SceneHomePage.currentFocusElementId)
    	{
    		$("#"+SceneHomePage.focusElements[i][1]).show();
    		if (SceneHomePage.focusElements[i][2])
    		{
    			$("#"+SceneHomePage.focusElements[i][2]).show();
    			SceneHomePage.stopRotatingCarousel();
    		}
    	} else {
    		$("#"+SceneHomePage.focusElements[i][1]).hide();
    		
    		if (SceneHomePage.focusElements[i][2])
    		{
    			$("#"+SceneHomePage.focusElements[i][2]).hide();
    		}
    	}  	
    }
};


SceneHomePage.launchCarousel = function() {
	//Launcing the carousel
	SceneHomePage.carousel = $("#carouselHP > *").rondell({
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

};

SceneHomePage.ParseXML = function (xmlURL) {

    $.ajax({
        type: "get",
        dataType: "xml",
        url: xmlURL,
        success: function(xml){
            if($(xml).find("image").length > 0){
                $(xml).find("image").each(function(){ // loop
                	var src = $(this).attr("src");
                	
                	$("#carouselHP").append('<a rel="rondell_1" href="#"><img src="'+src+'" width="914" height="514" class="carouselImage"/></a>');
                    
                });
            }
            
            SceneHomePage.launchCarousel();
        },
        error: function(){
            alert("xml error!!");
        }
    });
};

SceneHomePage.readLanguageFromFile = function() {
	var fs = new FileSystem();
	var fileObj = fs.openCommonFile('Saves.data', 'r');
	if (fileObj)
	{
		var str = fileObj.readAll();
		if (str[5] > -1)
			AppData.language = str[5];
		fs.closeCommonFile(fileObj);
	}
};

SceneHomePage.updateLangMenuView = function() {
	document.getElementById("active_line_home_page").style.top = Constants.langMenuSelector[SceneHomePage.currentLangSelector] + 'px';
	document.getElementById("selected_lang_home_page").style.top = Constants.langMenuActive[AppData.language] + 'px';		
};

SceneHomePage.showLanguageMenu = function() {
	SceneHomePage.isLangMenuShown = true;
	SceneHomePage.currentLangSelector = AppData.language;
	
	SceneHomePage.updateLangMenuView();

	$("#language_menu_homepage").fadeIn('fast');
};

SceneHomePage.hideLanguageMenu = function() {
	SceneHomePage.isLangMenuShown = false;
	
	$("#language_menu_homepage").fadeOut('fast');
};

SceneHomePage.setLanguage = function() {
	
	if (SceneHomePage.currentLangSelector != AppData.language)
	{
		AppData.language = SceneHomePage.currentLangSelector; 
		SceneHomePage.updateTextFields();
		
		SceneHomePage.saveLanguage();
	}
	
	SceneHomePage.hideLanguageMenu();
};

//We write language value to Saves.data file (sort of cookies) 
SceneHomePage.saveLanguage = function() {
	var fs = new FileSystem();
	var keyFile = fs.openCommonFile('Saves.data', 'w');
	keyFile.writeAll("lang:" + AppData.language);
    fs.closeCommonFile(keyFile);
};

SceneHomePage.prototype.keyLeftPress = function() {
	
	if (SceneHomePage.isLangMenuShown)
	{
		return;
	}
	
	var focusedId = SceneHomePage.currentFocusElementId;
	if (focusedId <= 2)
	{
		focusedId = focusedId == 0 ? 2 : focusedId - 1;
	} else {
		//Shift Carousel Left
		SceneHomePage.carousel.shiftLeft();
	}
	SceneHomePage.currentFocusElementId = focusedId;
	SceneHomePage.updateFocusElements();	
};
SceneHomePage.prototype.keyRightPress = function() {
	if (SceneHomePage.isLangMenuShown)
	{
		return;
	}

	var focusedId = SceneHomePage.currentFocusElementId;
	if (focusedId <= 2)
	{
		focusedId = focusedId == 2 ? 0 : focusedId + 1;
	} else {
		//Shift Carousel Right
		SceneHomePage.carousel.shiftRight();
	}	
	SceneHomePage.currentFocusElementId = focusedId;
	SceneHomePage.updateFocusElements();
};
SceneHomePage.prototype.keyUpPress = function() {
	
	if (SceneHomePage.isLangMenuShown)
	{
		SceneHomePage.currentLangSelector--;
		if (SceneHomePage.currentLangSelector == -1)
			SceneHomePage.currentLangSelector = 2;
		
		SceneHomePage.updateLangMenuView();
		
		return;
	}
	
	if (SceneHomePage.currentFocusElementId <= 2)
	{
		//Carousel
		SceneHomePage.currentFocusElementId = 3;
		SceneHomePage.stopRotatingCarousel();
	} else {
		//Middle menu
		SceneHomePage.currentFocusElementId = 0;
		SceneHomePage.startRotatingCarousel();
	}
	SceneHomePage.updateFocusElements();
	
};
SceneHomePage.prototype.keyDownPress = function() {
	
	if (SceneHomePage.isLangMenuShown)
	{
		SceneHomePage.currentLangSelector++;
		if (SceneHomePage.currentLangSelector == 3)
			SceneHomePage.currentLangSelector = 0;
		
		SceneHomePage.updateLangMenuView();
		
		return;
	}
	
	if (SceneHomePage.currentFocusElementId <= 2)
	{
		//Carousel
		SceneHomePage.currentFocusElementId = 3;
		SceneHomePage.stopRotatingCarousel();
	} else {
		//Top menu
		SceneHomePage.currentFocusElementId = 0;
		SceneHomePage.startRotatingCarousel();
	}
	SceneHomePage.updateFocusElements();		
};

SceneHomePage.prototype.keyEnterPress = function() {
	
	if (SceneHomePage.isVideoPlaying) {
		SceneHomePage.stopVideo();
		return;
	}

	switch (SceneHomePage.currentFocusElementId)
	{
		case 0:
			//Do smth
			break;
		case 1:
			//Play demo video
			SceneHomePage.playVideo();
			break;
		case 2:
			//Show language menu
			if (!SceneHomePage.isLangMenuShown)
				SceneHomePage.showLanguageMenu();
			else 
				SceneHomePage.setLanguage();
			break;
		case 3:
			//goto TV channels screen
			AppData.previousScreen = 'HomePage';
			Controller.changeScene('MainMenu');
			break;
	}
};


SceneHomePage.keyVolumeUpPress = function() {
	alert("Volume up pressed!");
	
};

SceneHomePage.keyVolumeDownPress = function() {
	alert("Volume down pressed!");
};

SceneHomePage.keyMutePress = function() {
	alert("Mute pressed!");
	/*
	if (userMute == 1) {
        Main.pluginAudio.SetUserMute(false);
    } else {
        Main.pluginAudio.SetUserMute(true);
    }*/
	
	SceneHomePage.pluginAudio.SetUserMute(true);

    var userMute = SceneHomePage.pluginAudio.GetUserMute();
    
    SceneHomePage.player.audioMute(userMute);
};

SceneHomePage.prototype.handleKeyDown = function (keyCode) {
    alert("SceneHP.handleKeyDown(" + keyCode + ")");
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
        case sf.key.VOL_UP:
        	SceneHomePage.keyVolumeUpPress();
			break;
        case sf.key.VOL_DOWN:
        	SceneHomePage.keyVolumeDownPress();
			break;
        case sf.key.MUTE:
        	SceneHomePage.keyMutePress();
			break;
    }
};

SceneHomePage.prototype.handleShow = function (data) {
    alert("SceneHP.handleShow()");
};

SceneHomePage.prototype.handleHide = function () {
    alert("SceneHP.handleHide()");
};

SceneHomePage.prototype.handleFocus = function () {
    alert("SceneHP.handleFocus()");
    
    SceneHomePage.readLanguageFromFile();
    
    SceneHomePage.updateTextFields();
    
	$('body').append(
		'<object type="application/x-shockwave-flash" width="1" height="1" id="flvplayer">' +
			'<param name="movie" value="flash/sound.swf"/>' +
			'<param name="quality" value="low"/>' +
			'<param name="bgcolor" value="black"/>' + 
		'</object>');
	
	SceneHomePage.player = window["flvplayer"];
	//SceneHomePage.pluginAudio = document.getElementById("pluginObjectAudio");
		
	//NNaviPlugin = document.getElementById("pluginObjectNNavi");
	//NNaviPlugin.SetBannerState(1);
	
};

SceneHomePage.prototype.handleBlur = function () {
    alert("SceneHP.handleBlur()");
};
