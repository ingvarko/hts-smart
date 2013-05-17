function SceneTVchannels() {
};


SceneTVchannels.topPositionsA = [0, 80, 160, 240, 320, 400];
//SceneTVchannels.positionColorsA = ["#5c4541", "#f8f7f6", "#fbfafa", "#c8bdb5", "#684f43", "#462512"];
SceneTVchannels.positionColorsA = ["#5c4541", "#c8bdb5", "#fbfafa", "#c8bdb5", "#684f43", "#462512"];
SceneTVchannels.elementsPositionA = [0, 1, 2, 3, 4, 5];
SceneTVchannels.listElements = null;
SceneTVchannels.activeMarkTopPositionsA = [93, 173, 253];
SceneTVchannels.currentActiveMarkTopIndex = 1;

SceneTVchannels.focusElements = [["back", "tv_focusElement_1"],
                             ["media", "tv_focusElement_2"],
                             ["musik", "tv_focusElement_3"]];
SceneTVchannels.currentFocusElementId = 0;


SceneTVchannels.prototype.initialize = function () {
    alert("SceneTVchannels.initialize()");    
    
    SceneTVchannels.listElements = [$("#channel_1"), $("#channel_2"), $("#channel_3"), 
           	                     $("#channel_4"), $("#channel_5"), $("#channel_6")];
    
    SceneTVchannels.updateFocusElements();
    
    SceneTVchannels.updateTextFields();

    //Basic inits for the elements positions
   	for (var i = 0; i < SceneTVchannels.listElements.length; i++)
   	{
   		SceneTVchannels.listElements[i].css({top: SceneTVchannels.topPositionsA[SceneTVchannels.elementsPositionA[i]], 
   								  color: SceneTVchannels.positionColorsA[SceneTVchannels.elementsPositionA[i]]});
   	}

   	$("#active_channel").css({top: SceneTVchannels.activeMarkTopPositionsA[SceneTVchannels.currentActiveMarkTopIndex]});
};

SceneTVchannels.updateTextFields = function() {
	var d = new Date();
	var n = d.getMonth();
	
	$("#month_name_tv").text(Languages["month"][n-1][AppData.language]);
	
	$("#back_to_prev_menu_tv").text(Languages["back_to_prev_menu_movietypes"][AppData.language]);
	$("#home_to_main_menu_tv").text(Languages["home_to_main_menu_movietypes"][AppData.language]);
};

//This method hide all unfocused elements and shows the focused one
SceneTVchannels.updateFocusElements = function() {
    for (var i = 0; i < SceneTVchannels.focusElements.length; i++)
    {
    	if (i == SceneTVchannels.currentFocusElementId)
    	{
    		$("#"+SceneTVchannels.focusElements[i][1]).show();
    		if (SceneTVchannels.focusElements[i][2])
    		{
    			$("#"+SceneTVchannels.focusElements[i][2]).show();
    			SceneTVchannels.stopRotatingCarousel();
    		}
    	} else {
    		$("#"+SceneTVchannels.focusElements[i][1]).hide();
    		
    		if (SceneTVchannels.focusElements[i][2])
    		{
    			$("#"+SceneTVchannels.focusElements[i][2]).hide();
    		}
    	}  	
    }
};



SceneTVchannels.moveListUp = function() {
	
	SceneTVchannels.moveList(-1);
	
};
SceneTVchannels.moveListDown = function() {

	SceneTVchannels.moveList(1);

};

SceneTVchannels.moveList = function(val) {
	for (var i = 0; i < SceneTVchannels.listElements.length; i++)
	{
		SceneTVchannels.elementsPositionA[i] += val;
		
		if (SceneTVchannels.elementsPositionA[i] >= SceneTVchannels.listElements.length)
			SceneTVchannels.elementsPositionA[i] = 0;
		
		if (SceneTVchannels.elementsPositionA[i] < 0)
			SceneTVchannels.elementsPositionA[i] = SceneTVchannels.listElements.length - 1;
	}

	SceneTVchannels.moveAndUpdateList();
};

//getting the new color of the list item on its new place by its content
SceneTVchannels.getColorByContent = function (content) {
	for (var i = 0; i < SceneTVchannels.listElements.length; i++)
	{
		if (SceneTVchannels.listElements[i].attr("id") == $(content).attr("id"))
		{
			return SceneTVchannels.positionColorsA[SceneTVchannels.elementsPositionA[i]];
		}
	}	
};

SceneTVchannels.moveAndUpdateList = function () {
	for (var i = 0; i < SceneTVchannels.listElements.length; i++)
	{
		SceneTVchannels.listElements[i].animate({
			"top" : SceneTVchannels.topPositionsA[SceneTVchannels.elementsPositionA[i]]}, 
			"fast", 
			function() {
				
				$(this).css({color:  SceneTVchannels.getColorByContent(this)}); 
			}
		);
	}	
};

SceneTVchannels.prototype.keyLeftPress = function() {
	var focusedId = SceneTVchannels.currentFocusElementId;
	if (focusedId <= 2)
	{
		focusedId = focusedId == 0 ? 2 : focusedId - 1;
	} else {
	}
	SceneTVchannels.currentFocusElementId = focusedId;
	SceneTVchannels.updateFocusElements();	
};
SceneTVchannels.prototype.keyRightPress = function() {
	var focusedId = SceneTVchannels.currentFocusElementId;
	if (focusedId <= 2)
	{
		focusedId = focusedId == 2 ? 0 : focusedId + 1;
	} else {
	}	
	SceneTVchannels.currentFocusElementId = focusedId;
	SceneTVchannels.updateFocusElements();
};
SceneTVchannels.prototype.keyUpPress = function() {
	SceneTVchannels.moveListUp();
};
SceneTVchannels.prototype.keyDownPress = function() {
	SceneTVchannels.moveListDown();
};
SceneTVchannels.prototype.keyEnterPress = function() {
	
	switch (SceneTVchannels.currentFocusElementId)
	{
		case 0:
			//go back
			AppData.previousScreen = 'TVchannels';
			Controller.changeScene(AppData.previousScreen);
			break;
		case 1:
			//goto Media channels screen
			AppData.previousScreen = 'TVchannels';
			Controller.changeScene('MovieTypes');
			break;
		case 2:
			//goto Musik screen
			break;
		case 3:
			//Carousel - select video to play
			//AppData.selectedItem = SceneTVchannels.movieTypesInfo[SceneTVchannels.carousel.currentLayer - 1];
			//play video
			break;
	}
};
SceneTVchannels.prototype.keyHomePress = function() {
	Controller.changeScene('MainMenu');
};
SceneTVchannels.prototype.keyBackPress = function() {
	//go back
	AppData.previousScreen = 'TVchannels';
	Controller.changeScene(AppData.previousScreen);
};


SceneTVchannels.prototype.handleKeyDown = function (keyCode) {
    alert("SceneTVchannels.handleKeyDown(" + keyCode + ")");
    switch (keyCode) {
	    case sf.key.LEFT:
	    	this.keyLeftPress();
	        break;
	    case sf.key.RIGHT:
	    	this.keyRightPress();
	        break;
	    case sf.key.UP:
	    	this.keyUpPress();
	        break;
	    case sf.key.DOWN:
	    	this.keyDownPress();
	        break;
	    case sf.key.ENTER:
	    	this.keyEnterPress();
	        break;
	    case sf.key.BACK:
	    	this.keyBackPress();
	    	break;
	    case sf.key.HOME:
	    	this.keyHomePress();
	    	break;
    }
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
