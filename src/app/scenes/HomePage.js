function SceneHomePage() {
};

SceneHomePage.prototype.initialize = function () {
    alert("SceneHP.initialize()");
    
    //Parsing the xml and adding images to html page
    SceneHomePage.ParseXML("XML/HomePage_carousel.xml");
    
    SceneHomePage.updateTextFields();
};

SceneHomePage.carousel = null;

SceneHomePage.updateTextFields = function() {
	var d = new Date();
	var n = d.getMonth();
	
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
    });

	$(".loaderImg").hide();
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


SceneHomePage.prototype.handleShow = function (data) {
    alert("SceneHP.handleShow()");
};

SceneHomePage.prototype.handleHide = function () {
    alert("SceneHP.handleHide()");
};

SceneHomePage.prototype.handleFocus = function () {
    alert("SceneHP.handleFocus()");
};

SceneHomePage.prototype.handleBlur = function () {
    alert("SceneHP.handleBlur()");
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
    }
};