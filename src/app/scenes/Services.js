function SceneServices() {
};

SceneServices.prototype.initialize = function () {
    alert("SceneServices.initialize()");
    
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

SceneServices.prototype.handleShow = function (data) {
    alert("SceneServices.handleShow()");
};

SceneServices.prototype.handleHide = function () {
    alert("SceneServices.handleHide()");
};

SceneServices.prototype.handleFocus = function () {
    alert("SceneServices.handleFocus()");
};

SceneServices.prototype.handleBlur = function () {
    alert("SceneServices.handleBlur()");
};

SceneServices.prototype.handleKeyDown = function (keyCode) {
    alert("SceneServices.handleKeyDown(" + keyCode + ")");
    switch (keyCode) {
        case sf.key.LEFT:
        	Controller.changeScene('HomePage');
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