function SceneMovieTypes() {
};

SceneMovieTypes.prototype.initialize = function () {
    alert("SceneMovieTypes.initialize()");
    
    //Parsing the xml and adding images to html page
    SceneMovieTypes.ParseXML("XML/MovieTypes_carousel.xml");
};

SceneMovieTypes.carousel = null;

SceneMovieTypes.launchCarousel = function() {
	//Launcing the carousel
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
    	  enabled: true,
    	  delay: Constants.carouselInterval
      }
    });

	$(".loaderImg").hide();
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
                    
                });
            }
            
            SceneMovieTypes.launchCarousel();
        },
        error: function(){
            alert("xml error!!");
        }
    });
};


SceneMovieTypes.prototype.handleShow = function (data) {
    alert("SceneMovieTypes.handleShow()");
};

SceneMovieTypes.prototype.handleHide = function () {
    alert("SceneMovieTypes.handleHide()");
};

SceneMovieTypes.prototype.handleFocus = function () {
    alert("SceneMovieTypes.handleFocus()");
};

SceneMovieTypes.prototype.handleBlur = function () {
    alert("SceneMovieTypes.handleBlur()");
};

SceneMovieTypes.prototype.handleKeyDown = function (keyCode) {
    alert("SceneMovieTypes.handleKeyDown(" + keyCode + ")");
    switch (keyCode) {
        case sf.key.LEFT:
        	SceneMovieTypes.carousel.shiftLeft();
            break;
        case sf.key.RIGHT:
        	SceneMovieTypes.carousel.shiftRight();
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