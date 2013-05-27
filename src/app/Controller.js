var Controller = {
};
Controller.currentScene = null;

Controller.settings = null;

Controller.initialize = function () {
	alert("Controller.initialize()");
};

Controller.start = function () {
	alert("Controller.start()");
	
	Controller.changeScene('HomePage');
	//Controller.changeScene('MainMenu');
	//Controller.changeScene('MovieTypes');
	//Controller.changeScene('Movies');
	//Controller.changeScene('TVchannels');
};
Controller.changeScene = function(newScene) {
	$(".loaderImg").show();
	if (this.currentScene)
	{
		sf.scene.hide(this.currentScene);
	}
	sf.scene.show(newScene);
	sf.scene.focus(newScene);
	this.currentScene = newScene;
	$(".loaderImg").hide();
};