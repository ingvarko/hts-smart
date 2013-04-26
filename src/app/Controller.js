var Controller = {
};
Controller.currentScene = null;

Controller.initialize = function () {
	alert("Controller.initialize()");
};

Controller.start = function () {
	alert("Controller.start()");
	this.currentScene = 'HomePage'; 
	sf.scene.show(this.currentScene);
	sf.scene.focus(this.currentScene);
};
Controller.changeScene = function(newScene) {
	$(".loaderImg").show();
	sf.scene.hide(this.currentScene);
	sf.scene.show(newScene);
	sf.scene.focus(newScene);
	this.currentScene = newScene;
	$(".loaderImg").hide();
};