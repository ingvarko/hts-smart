function SceneTVchannels() {
};


//----------------------------------------------------------------------
//Channels categories
//----------------------------------------------------------------------
SceneTVchannels.topPositionsA = [0, 80, 160, 240, 320, 400];
SceneTVchannels.positionColorsA = ["#5c4541", "#c8bdb5", "#fbfafa", "#c8bdb5", "#684f43", "#462512"];
//positions of xml channels' categories items on the screen (will be changing when clicking arrows)
SceneTVchannels.elementsPositionA = [];
//links to div elements that represent channels' categories
SceneTVchannels.listElements = [];
//Array with categories' ids (we will need that for getting the channels with certain category id
SceneTVchannels.listElementsIds = [];

SceneTVchannels.activeMarkTopPositionsA = [93, 173, 253];
//The active channels' categories mark index (3 possible options,
//but only one enabled - the mark doesn't move, the entire list does)
SceneTVchannels.currentActiveMarkTopIndex = 1;
//Index of current active category (it will always be the same, as the elementsPositionsA array changes) 
SceneTVchannels.currentCategoryIndex = 2;

//----------------------------------------------------------------------
//Actual channels
//----------------------------------------------------------------------
SceneTVchannels.topPositionsChn = [0, 400, 0, 400, 0, 400, 0, 400];
SceneTVchannels.leftPositionsChn = [-145, -145, 255, 255, 655, 655, 1055, 1055];
//positions of xml channels items on the screen (will be changing when clicking arrows)
SceneTVchannels.elementsPositionChn = [0, 1, 2, 3, 4, 5, 6, 7];
//Images sources for channels' backgrounds (normal and active)
SceneTVchannels.channelsBgImSrc = ["images/channel_bg.png", "images/active_channel_bg.png"];
//links to div elements that represent channels
SceneTVchannels.listElementsChn = [];
SceneTVchannels.channelsCnt = 0;
//Here we will save the info about channels
SceneTVchannels.channelsData = [];
SceneTVchannels.currentActiveChannelIndex = 2;

SceneTVchannels.focusElements = [["back", "tv_focusElement_1"],
                             ["media", "tv_focusElement_2"],
                             ["musik", "tv_focusElement_3"],
                             ["categories", "tv_focusElement_4"],
                             ["carousel", "tv_focusElement_5", "tv_focusElement_6"]
                             ];
SceneTVchannels.currentFocusElementId = 4;


SceneTVchannels.prototype.initialize = function () {
    alert("SceneTVchannels.initialize()");    
    
    SceneTVchannels.loadCategories("XML/Channels_categories.xml");
    
    SceneTVchannels.updateFocusElements();
    
    SceneTVchannels.updateTextFields();
};

//We init channels' categories list after it's loaded from xml, show/hide needed elements
SceneTVchannels.doCategoriesInit = function() {
    //SceneTVchannels.listElements = [];

    if (SceneTVchannels.listElements.length == 4)
    {
    	SceneTVchannels.elementsPositionA = [0, 1, 2, 3];
    	$("#channel_line_4").hide();
    	$("#channel_line_5").hide();
    	
    } else if (SceneTVchannels.listElements.length == 5) {
    	SceneTVchannels.elementsPositionA = [0, 1, 2, 3, 4];
    	$("#channel_line_5").hide();
    } else {
    	SceneTVchannels.elementsPositionA = [0, 1, 2, 3, 4, 5];
    }
    
    
    //Basic inits for the channels' categories positions
   	for (var i = 0; i < SceneTVchannels.listElements.length; i++)
   	{
   		if (i < SceneTVchannels.elementsPositionA.length)
   		{
   			SceneTVchannels.listElements[i].show().css({top: SceneTVchannels.topPositionsA[SceneTVchannels.elementsPositionA[i]], 
   								  color: SceneTVchannels.positionColorsA[SceneTVchannels.elementsPositionA[i]]});
   		} else {
   			SceneTVchannels.listElements[i].hide().css({top : -100});
   		}
   	}

   	$("#active_channel").css({top: SceneTVchannels.activeMarkTopPositionsA[SceneTVchannels.currentActiveMarkTopIndex]});

   	//Now when the categories are loaded and displayed, let load the channels
   	SceneTVchannels.loadChannels();
};

SceneTVchannels.loadCategories = function(xmlURL) {
    $.ajax({
        type: "get",
        dataType: "xml",
        url: xmlURL,
        success: function(xml){
            if($(xml).find("tv_category").length > 0){
            	i = 0;
                $(xml).find("tv_category").each(function(i){ // loop
                	i++;
                	var id = $(this).attr("id");
                	
                	$(".channelList").append('<div class="tvListItem" id="channel_category_'+i+'">'+
                			Languages[id][AppData.language] +'</div>');
                	
                	SceneTVchannels.listElementsIds.push(id);
                	
                	SceneTVchannels.listElements.push($("#channel_category_"+i));   	
                });
            }
            SceneTVchannels.doCategoriesInit();
        },
        error: function(){
            alert("xml error!!");
        }
    });
};

SceneTVchannels.loadChannels = function() {
	$(".channel_img").remove();
	SceneTVchannels.listElementsChn = [];
	SceneTVchannels.channelsData = [];
	
    $.ajax({
        type: "get",
        dataType: "xml",
        url: "XML/Channels.xml",
        success: function(xml){
            if($(xml).find("tv_channel").length > 0){
            	i = 0;
                $(xml).find("tv_channel").each(function(i){ // loop
                	//alert(SceneTVchannels.listElementsIds[SceneTVchannels.elementsPositionA[SceneTVchannels.currentCategoryIndex]]);
                	if ($(this).attr("catId") == 
                		SceneTVchannels.listElementsIds[SceneTVchannels.elementsPositionA[SceneTVchannels.currentCategoryIndex]])
                	{
	                	i++;
	                	var id = $(this).attr("id");
	                	var imgSrc = $(this).attr("imgSrc");
	                	
	                	SceneTVchannels.channelsData.push([id, imgSrc]);
                	}
                });
                
                i = SceneTVchannels.channelsData.length;
                
                if (i < 4) {
                	return;
                } else if (i == 4) {
                	SceneTVchannels.channelsData.push(SceneTVchannels.channelsData[0],
                			SceneTVchannels.channelsData[1],
                			SceneTVchannels.channelsData[2],
                			SceneTVchannels.channelsData[3]);
                } else if (i == 5) {
                	SceneTVchannels.channelsData.push(SceneTVchannels.channelsData[1],
							  SceneTVchannels.channelsData[2],
							  SceneTVchannels.channelsData[3]);                	
                } else if (i == 6) {
                	SceneTVchannels.channelsData.push(SceneTVchannels.channelsData[2],
							  SceneTVchannels.channelsData[3]);                	
                } else if (i == 7) {
                	SceneTVchannels.channelsData.push(SceneTVchannels.channelsData[2]);
                }
                
	                	
                for (var i = 0; i < SceneTVchannels.channelsData.length; i++)
                {
                	$(".channelsImageList").append(
                			'<div class="channel_img" id="channel_img_'+i+'">' +
						'<div class="channel_img_inner">' +
							'<img src="images/channel_bg.png" width="390" height="390" class="channel_img_bg" />' +
							'<img src="'+ SceneTVchannels.channelsData[i][1] +'" class="channel_img_pic" width="337" height="337"/>' +
							'<img src="images/tv_channels_mask.png" class="channel_img_mask" width="337" height="83"/>' +
							'<div class="channel_img_text">'+ Languages[SceneTVchannels.channelsData[i][0]][AppData.language] + '</div>' +
						'</div>' +
					'</div>');
                	
                	SceneTVchannels.listElementsChn.push($("#channel_img_"+i));
            	}
                
            }
            
            SceneTVchannels.doChannelsInit();
        },
        error: function(){
            alert("xml error!!");
        }
    });
};

//We init channels list, show/hide needed elements
SceneTVchannels.doChannelsInit = function() {
    //SceneTVchannels.listElementsChn = [];

    SceneTVchannels.channelsCnt = SceneTVchannels.listElementsChn.length;
    
    //Basic inits for the channels positions
   	for (var i = 0; i < SceneTVchannels.listElementsChn.length; i++)
   	{
   		if (i < SceneTVchannels.elementsPositionChn.length)
   		{
   			SceneTVchannels.listElementsChn[i].show().css({top: SceneTVchannels.topPositionsChn[SceneTVchannels.elementsPositionChn[i]], 
   								left: SceneTVchannels.leftPositionsChn[SceneTVchannels.elementsPositionChn[i]]});
   		} else {
   			SceneTVchannels.listElementsChn[i].hide();
   		}
   	}
   	
   	var activeElementIndex = SceneTVchannels.elementsPositionChn[SceneTVchannels.currentActiveChannelIndex];
   	SceneTVchannels.listElementsChn[activeElementIndex].find(".channel_img_bg").attr("src", SceneTVchannels.channelsBgImSrc[1]);

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

SceneTVchannels.moveChannelsLeft = function() {
	
	if (SceneTVchannels.currentActiveChannelIndex != 2)
	{
		SceneTVchannels.currentActiveChannelIndex--;
	} else {
		SceneTVchannels.currentActiveChannelIndex++;
		SceneTVchannels.moveChannels(-1);
	}
	
	SceneTVchannels.updateActiveChannelMark();
};

SceneTVchannels.moveChannelsRight = function() {
	
	if (SceneTVchannels.currentActiveChannelIndex != 5)
	{
		SceneTVchannels.currentActiveChannelIndex++;
	} else {
		SceneTVchannels.currentActiveChannelIndex--;
		SceneTVchannels.moveChannels(1);
	}
	
	SceneTVchannels.updateActiveChannelMark();
	
};

SceneTVchannels.moveChannels = function(val) {
	if (SceneTVchannels.channelsCnt <= 4)
		return;
		
	for (var i = 0; i < SceneTVchannels.elementsPositionChn.length; i++)
	{
		SceneTVchannels.elementsPositionChn[i] += 2 * val;
		
		if (SceneTVchannels.elementsPositionChn[i] >= SceneTVchannels.listElementsChn.length)
		{
			SceneTVchannels.elementsPositionChn[i] -= SceneTVchannels.listElementsChn.length;
		}
		
		if (SceneTVchannels.elementsPositionChn[i] < 0)
			SceneTVchannels.elementsPositionChn[i] += SceneTVchannels.listElementsChn.length;
	}

	SceneTVchannels.moveAndUpdateChannels(val);
};

SceneTVchannels.moveAndUpdateChannels = function (val) {
	for (var i = 0; i < SceneTVchannels.listElementsChn.length; i++)
	{
		if ($.inArray(i, SceneTVchannels.elementsPositionChn) == -1)
		{
			SceneTVchannels.listElementsChn[i].hide();
		} else {
			if ( val < 0 && (SceneTVchannels.elementsPositionChn.indexOf(i) == 0 || 
					SceneTVchannels.elementsPositionChn.indexOf(i) == 1) || (val > 0 && 
							(SceneTVchannels.elementsPositionChn.indexOf(i) == SceneTVchannels.elementsPositionChn.length - 2 || 
					SceneTVchannels.elementsPositionChn.indexOf(i) == SceneTVchannels.elementsPositionChn.length - 1)) )
			{
				SceneTVchannels.listElementsChn[i].show().css({
					left : SceneTVchannels.leftPositionsChn[SceneTVchannels.elementsPositionChn.indexOf(i)],
					top : SceneTVchannels.topPositionsChn[SceneTVchannels.elementsPositionChn.indexOf(i)]});
			} else {
				SceneTVchannels.listElementsChn[i].show().animate({
					"left" : SceneTVchannels.leftPositionsChn[SceneTVchannels.elementsPositionChn.indexOf(i)],
					"top" : SceneTVchannels.topPositionsChn[SceneTVchannels.elementsPositionChn.indexOf(i)]}, 
					"slow", 
					function() {}
				);
			}
		}	
	}
};

SceneTVchannels.updateActiveChannelMark = function() {

	for (var i = 0; i < SceneTVchannels.listElementsChn.length; i++)
	{
		SceneTVchannels.listElementsChn[i].find(".channel_img_bg").attr("src", SceneTVchannels.channelsBgImSrc[0]);
	}
	
	var activeElementIndex = SceneTVchannels.elementsPositionChn[SceneTVchannels.currentActiveChannelIndex];
   	SceneTVchannels.listElementsChn[activeElementIndex].find(".channel_img_bg").attr("src", SceneTVchannels.channelsBgImSrc[1]);
};

SceneTVchannels.moveListUp = function() {
	
	SceneTVchannels.moveList(-1);
	
};
SceneTVchannels.moveListDown = function() {

	SceneTVchannels.moveList(1);

};

SceneTVchannels.moveList = function(val) {
	for (var i = 0; i < SceneTVchannels.elementsPositionA.length; i++)
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
			return SceneTVchannels.positionColorsA[SceneTVchannels.elementsPositionA.indexOf(i)];
		}
	}	
};

SceneTVchannels.moveAndUpdateList = function () {
	for (var i = 0; i < SceneTVchannels.listElements.length; i++)
	{
		if ($.inArray(i, SceneTVchannels.elementsPositionA) == -1)
		{
			SceneTVchannels.listElements[i].hide().css({top : -100});
		} else {
			SceneTVchannels.listElements[i].show().animate({
				"top" : SceneTVchannels.topPositionsA[SceneTVchannels.elementsPositionA.indexOf(i)]}, 
				"fast", 
				function() {
					
					$(this).css({color:  SceneTVchannels.getColorByContent(this)}); 
				}
			);	
		}			
	}	
};

SceneTVchannels.prototype.keyLeftPress = function() {
	var focusedId = SceneTVchannels.currentFocusElementId;
	if (focusedId <= 2)
	{
		focusedId = focusedId == 0 ? 2 : focusedId - 1;
	} else if (focusedId <= 3) {
		SceneTVchannels.moveListDown();
		
		SceneTVchannels.loadChannels();
	} else {
		//move carousel left
		SceneTVchannels.moveChannelsLeft();
	}
	SceneTVchannels.currentFocusElementId = focusedId;
	SceneTVchannels.updateFocusElements();	
};
SceneTVchannels.prototype.keyRightPress = function() {
	var focusedId = SceneTVchannels.currentFocusElementId;
	if (focusedId <= 2)
	{
		focusedId = focusedId == 2 ? 0 : focusedId + 1;
	} else if (focusedId <= 3) {
		SceneTVchannels.moveListUp();
		
		SceneTVchannels.loadChannels();
	} else {
		//move carousel right
		SceneTVchannels.moveChannelsRight();
	}
	SceneTVchannels.currentFocusElementId = focusedId;
	SceneTVchannels.updateFocusElements();
};
SceneTVchannels.prototype.keyUpPress = function() {
	var focusedId = SceneTVchannels.currentFocusElementId;
	if (focusedId <= 2)
	{
		focusedId = 4;
	} else if (focusedId <= 3) {
		focusedId = 0;
	} else {
		focusedId = 3;
	}
	SceneTVchannels.currentFocusElementId = focusedId;
	SceneTVchannels.updateFocusElements();	

};
SceneTVchannels.prototype.keyDownPress = function() {
	var focusedId = SceneTVchannels.currentFocusElementId;
	if (focusedId <= 2)
	{
		focusedId = 3;
	} else if (focusedId <= 3) {
		focusedId = 4;
	} else {
		focusedId = 0;
	}
	SceneTVchannels.currentFocusElementId = focusedId;
	SceneTVchannels.updateFocusElements();
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
