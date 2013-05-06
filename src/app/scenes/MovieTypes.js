function SceneMovies() {
};

SceneMovies.prototype.initialize = function () {
    alert("SceneMovies.initialize()");
    
    //Parsing the xml and adding images to html page
    SceneMovies.ParseXML("XML/Movies_carousel.xml");
};

SceneMovies.carousel = null;

SceneMovies.launchCarousel = function() {
	//Launcing the carousel
	SceneMovies.carousel = $("#carouselM > *").rondell({
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

SceneMovies.ParseXML = function (xmlURL) {

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
            
            SceneMovies.launchCarousel();
        },
        error: function(){
            alert("xml error!!");
        }
    });
};


SceneMovies.prototype.handleShow = function (data) {
    alert("SceneMovies.handleShow()");
};

SceneMovies.prototype.handleHide = function () {
    alert("SceneMovies.handleHide()");
};

SceneMovies.prototype.handleFocus = function () {
    alert("SceneMovies.handleFocus()");
};

SceneMovies.prototype.handleBlur = function () {
    alert("SceneMovies.handleBlur()");
};

SceneMovies.prototype.handleKeyDown = function (keyCode) {
    alert("SceneMovies.handleKeyDown(" + keyCode + ")");
    switch (keyCode) {
        case sf.key.LEFT:
        	SceneMovies.carousel.shiftLeft();
            break;
        case sf.key.RIGHT:
        	SceneMovies.carousel.shiftRight();
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