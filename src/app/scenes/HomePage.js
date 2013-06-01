function SceneHomePage() {
};

SceneHomePage.pluginAPI = new Common.API.Plugin();
SceneHomePage.pluginAudio = null;
SceneHomePage.player = null;

SceneHomePage.prototype.initialize = function () {
    alert("SceneHP.initialize()");
    
    //Parsing the xml and adding images to html page
    SceneHomePage.ParseXML("XML/HomePage_carousel.xml");
    
    SceneHomePage.updateTextFields();
    
	/*sf.key.registerKey(sf.key.VOL_UP);
	sf.key.registerKey(sf.key.VOL_DOWN);
	sf.key.registerKey(sf.key.MUTE);*/
};

SceneHomePage.carousel = null;

SceneHomePage.updateTextFields = function() {
	var d = new Date();
	var n = d.getMonth();
	
	$("#language_text_label_homemenu").text(Languages["langTexts"][AppData.language]);
	$("#month_name").text(Languages["month"][n-1][AppData.language]);
	$("#hotel_name_text").text(Languages["hotel_name_text"][AppData.language]);
	$("#hotel_welcome_msg_text").text(Languages["hotel_welcome_msg_text"][AppData.language]);
	$("#press_enter_text").text(Languages["press_enter_text"][AppData.language]);
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
    	  enabled: true,
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
        	//SceneHomePage.carousel.shiftLeft();
            break;
        case sf.key.RIGHT:
        	//SceneHomePage.carousel.shiftRight();
            break;
        case sf.key.UP:
            break;
        case sf.key.DOWN:
            break;
        case sf.key.ENTER:
        	Controller.changeScene('MainMenu');
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