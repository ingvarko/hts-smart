function SceneHomePage() {
};

SceneHomePage.prototype.initialize = function () {
    alert("SceneHP.initialize()");
    
	//Launcing the carousel
	var carousel = $("#carousel > *").rondell({
      preset: "carousel",
      size: {
    	  width: 1620,
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
    	  left: 810,
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
        	Controller.changeScene('Services');
            break;
        case sf.key.RIGHT:
            break;
        case sf.key.UP:
            break;
        case sf.key.DOWN:
            break;
        case sf.key.ENTER:
            break;
    }
};