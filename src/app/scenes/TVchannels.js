function SceneTVchannels() {
};

SceneTVchannels.prototype.initialize = function () {
    alert("SceneTVchannels.initialize()");
    
    //Parsing the xml and adding images to html page
    SceneTVchannels.ParseXML("XML/Movies_carousel.xml");
};

SceneTVchannels.carousel = null;

SceneTVchannels.launchCarousel = function() {
	//Launcing the carousel
	SceneTVchannels.carousel = $("#carouselM > *").rondell({
      preset: "carousel",
      size: {
    	  width: 1220,
          height: 448  
      },
      scaling: 1,
      itemProperties: {
    	  size: {
    		  width: 797,
    		  height: 448
       	  }
      },
      center: {
    	  left: 610,
    	  top: 224
      },
      radius: {
    	  x: 300
      },
      autoRotation: {
    	  enabled: true,
    	  delay: Constants.carouselInterval
      }
    });

	$(".loaderImg").hide();
};

SceneTVchannels.ParseXML = function (xmlURL) {

    $.ajax({
        type: "get",
        dataType: "xml",
        url: xmlURL,
        success: function(xml){
            if($(xml).find("image").length > 0){
                $(xml).find("image").each(function(){ // loop
                	var src = $(this).attr("src");
                	
                	$("#carouselM").append('<a rel="rondell_1" href="#"><img src="'+src+'" width="914" height="514" class="carouselImage"/></a>');
                    
                });
            }
            
            SceneTVchannels.launchCarousel();
        },
        error: function(){
            alert("xml error!!");
        }
    });
};


SceneTVchannels.prototype.handleShow = function (data) {
    alert("SceneTVchannels.handleShow()");
};

SceneTVchannels.prototype.handleHide = function () {
    alert("SceneTVchannels.handleHide()");
};

SceneTVchannels.prototype.handleFocus = function () {
    alert("SceneTVchannels.handleFocus()");
};

SceneTVchannels.prototype.handleBlur = function () {
    alert("SceneTVchannels.handleBlur()");
};

SceneTVchannels.prototype.handleKeyDown = function (keyCode) {
    alert("SceneTVchannels.handleKeyDown(" + keyCode + ")");
    switch (keyCode) {
        case sf.key.LEFT:
        	SceneTVchannels.carousel.shiftLeft();
            break;
        case sf.key.RIGHT:
        	SceneTVchannels.carousel.shiftRight();
            break;
        case sf.key.UP:
            break;
        case sf.key.DOWN:
            break;
        case sf.key.ENTER:
        	//Controller.changeScene('MainMenu');
            break;
    }
};