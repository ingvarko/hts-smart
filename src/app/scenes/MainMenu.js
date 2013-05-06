function SceneMainMenu() {
};

SceneMainMenu.prototype.initialize = function () {
    alert("SceneServices.initialize()");
    
    SceneMainMenu.ParseXML("XML/MainMenu_carousel.xml");
};

SceneMainMenu.carousel = null;

SceneMainMenu.launchCarousel = function() {
	//Launcing the carousel
	alert('Launching carousel from Services-------------------------');
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

SceneMainMenu.prototype.handleKeyDown = function (keyCode) {
    alert("SceneServices.handleKeyDown(" + keyCode + ")");
    switch (keyCode) {
        case sf.key.LEFT:
        	SceneMainMenu.carousel.shiftLeft();
            break;
        case sf.key.RIGHT:
        	SceneMainMenu.carousel.shiftRight();
            break;
        case sf.key.UP:
            break;
        case sf.key.DOWN:
            break;
        case sf.key.ENTER:
            break;
    }
};