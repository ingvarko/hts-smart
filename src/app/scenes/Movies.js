function SceneMovies() {
};

SceneMovies.isVideoPlaying = false;
SceneMovies.isVideoOnPause = false;
SceneMovies.carousel = null;
SceneMovies.isRotatingCarousel = false;
SceneMovies.focusElements = [ [ "back", "movies_focusElement_1" ],
		[ "tv", "movies_focusElement_2" ],
		[ "musik", "movies_focusElement_3" ],
		[ "carousel", "movies_focusElement_4", "movies_focusElement_5" ] ];
SceneMovies.currentActiveMovieIndex = null;
SceneMovies.moviesInfo = [];
SceneMovies.currentFocusElementId = 3;

SceneMovies.prototype.initialize = function() {
	alert("SceneMovies.initialize()");

	// Parsing the xml and adding images to html page
	SceneMovies.ParseXML("XML/Movies_carousel.xml");

	SceneMovies.updateFocusElements();

	SceneMovies.updateTextFields();
};

SceneMovies.updateTextFields = function() {
	var d = new Date();
	var n = d.getMonth();

	$("#month_name_movies").text(Languages["month"][n - 1][AppData.language]);
	if (AppData.selectedItem)
		$("#movies_category_title_text").text(
				Languages[AppData.selectedItem][AppData.language]);
	$("#back_to_prev_menu_movies").text(
			Languages["back_to_prev_menu_movietypes"][AppData.language]);
	$("#home_to_main_menu_movies").text(
			Languages["home_to_main_menu_movietypes"][AppData.language]);
};

SceneMovies.rotateCarousel = function() {

	if (SceneMovies.isRotatingCarousel) {
		SceneMovies.carousel.shiftRight();

		setTimeout(function() {
			SceneMovies.rotateCarousel();
		}, Constants.carouselInterval);

		SceneMovies.updateText();
	}
};

SceneMovies.startRotatingCarousel = function() {
	if (SceneMovies.currentFocusElementId == 3)
		return;

	SceneMovies.isRotatingCarousel = true;

	setTimeout(function() {
		SceneMovies.rotateCarousel();
	}, Constants.carouselInterval);
};

SceneMovies.stopRotatingCarousel = function() {
	SceneMovies.isRotatingCarousel = false;
};

// Here we update the title text
SceneMovies.updateText = function() {
	// $("#bottom_carousel_text").text(SceneMovies.movieTypesInfo[SceneMovies.carousel.currentLayer
	// - 1]);

	SceneMovies.currentActiveMovieIndex = SceneMovies.carousel.currentLayer - 1;
	var textId = SceneMovies.moviesInfo[SceneMovies.currentActiveMovieIndex][0];

	if (textId) {
		document.getElementById("movie_name_text").innerHTML = Languages[textId][AppData.language];
		document.getElementById("movie_description_text").innerHTML = Languages[textId
				+ "_desc"][AppData.language];
	}
};

// Play/Pause video
SceneMovies.playPauseVideo = function() {
	if (SceneMovies.isVideoPlaying) {
		if (SceneMovies.isVideoOnPause) {
			sf.service.VideoPlayer.resume();
			SceneMovies.isVideoOnPause = false;
		} else {
			sf.service.VideoPlayer.pause();
			SceneMovies.isVideoOnPause = true;
		}
	}
};

// Stop playing video (custom stop or the video ended).
SceneMovies.stopVideo = function() {
	if (SceneMovies.isVideoPlaying) {
		SceneMovies.isVideoPlaying = false;

		sf.service.VideoPlayer.stop();

		sf.service.VideoPlayer.hide();
	}

	// video is over, we can continue playing bg music
	var player = document.getElementById("flvplayer");
	if (player)
		$(player).show();
};

// User clicked Enter on the movie - no way out, let's play it :)
SceneMovies.playVideo = function() {

	// first we have to stop playing bg music
	var player = document.getElementById("flvplayer");
	if (player)
		$(player).hide();

	SceneMovies.isVideoPlaying = true;

	sf.service.VideoPlayer.setZIndex(100005);

	sf.service.VideoPlayer.init({
		onend : function() {
			alert('Video ended.');
			SceneMovies.stopVideo();
		},
		onerror : function(error) {
			alert('Error : ' + error);
			SceneMovies.stopVideo();
		}
	});

	sf.service.VideoPlayer.setPosition({
		left : 0,
		top : 0,
		width : 1920,
		height : 1080
	});

	// TODO:Sets Player as fullscreen mode - do that when testing on real device
	// sf.service.VideoPlayer.setFullScreen(true);

	var url = null;
	// SceneMovies.moviesInfo[]
	if (SceneMovies.moviesInfo[SceneMovies.currentActiveMovieIndex][1] == "local") {
		url = getAbsPath(SceneMovies.moviesInfo[SceneMovies.currentActiveMovieIndex][2]);
	} else if (SceneMovies.moviesInfo[SceneMovies.currentActiveMovieIndex][1] == "url") {
		url = SceneMovies.moviesInfo[SceneMovies.currentActiveMovieIndex][2];
	}

	if (url) {
		// starts playback
		sf.service.VideoPlayer.play({
			url : url,
			fullScreen : false
		});
	}
};

// This method hide all unfocused elements and shows the focused one
SceneMovies.updateFocusElements = function() {
	for ( var i = 0; i < SceneMovies.focusElements.length; i++) {
		if (i == SceneMovies.currentFocusElementId) {
			$("#" + SceneMovies.focusElements[i][1]).show();
			if (SceneMovies.focusElements[i][2]) {
				$("#" + SceneMovies.focusElements[i][2]).show();
				SceneMovies.stopRotatingCarousel();
			}
		} else {
			$("#" + SceneMovies.focusElements[i][1]).hide();

			if (SceneMovies.focusElements[i][2]) {
				$("#" + SceneMovies.focusElements[i][2]).hide();
			}
		}
	}
};

SceneMovies.launchCarousel = function() {
	SceneMovies.carousel = null;
	// Launcing the carousel
	SceneMovies.carousel = $("#carouselM > *").rondell({
		preset : "carousel",
		size : {
			width : 1220,
			height : 448
		},
		scaling : 1.5,
		itemProperties : {
			size : {
				width : 531,
				height : 297
			}
		},
		center : {
			left : 610,
			top : 224
		},
		radius : {
			x : 300
		},
		visibleItems : 2,
		autoRotation : {
			enabled : false
		}
	}, function() {
		$(".loaderImg").hide();
	});

	SceneMovies.startRotatingCarousel();
	SceneMovies.updateText();

};

SceneMovies.ParseXML = function(xmlURL) {

	$("#carouselM").text("");
	SceneMovies.moviesInfo = [];

	$
			.ajax({
				type : "get",
				dataType : "xml",
				url : xmlURL,
				success : function(xml) {
					$(xml)
							.find("images")
							.each(
									function() { // loop
										if ($(this).attr("categoryId") == AppData.selectedItem) {
											if ($(this).find("image").length > 0) {

												$(this)
														.find("image")
														.each(
																function() { // loop
																	var src = $(
																			this)
																			.attr(
																					"src");

																	$(
																			"#carouselM")
																			.append(
																					'<a rel="rondell_1" href="#"><img src="'
																							+ src
																							+ '" width="914" height="514" class="carouselImage"/></a>');

																	SceneMovies.moviesInfo
																			.push([
																					$(
																							this)
																							.attr(
																									"id"),
																					$(
																							this)
																							.attr(
																									"type"),
																					$(
																							this)
																							.attr(
																									"url") ]);
																});
											}
										}
									});

					SceneMovies.launchCarousel();
				},
				error : function() {
					alert("xml error!!");
				}
			});
};

SceneMovies.prototype.keyLeftPress = function() {
	var focusedId = SceneMovies.currentFocusElementId;
	if (focusedId <= 2) {
		focusedId = focusedId == 0 ? 2 : focusedId - 1;
	} else {
		// Shift Carousel Left
		SceneMovies.carousel.shiftLeft();
		SceneMovies.updateText();
	}
	SceneMovies.currentFocusElementId = focusedId;
	SceneMovies.updateFocusElements();
};
SceneMovies.prototype.keyRightPress = function() {
	var focusedId = SceneMovies.currentFocusElementId;
	if (focusedId <= 2) {
		focusedId = focusedId == 2 ? 0 : focusedId + 1;
	} else {
		// Shift Carousel Right
		SceneMovies.carousel.shiftRight();
		SceneMovies.updateText();
	}
	SceneMovies.currentFocusElementId = focusedId;
	SceneMovies.updateFocusElements();
};
SceneMovies.prototype.keyUpPress = function() {
	if (SceneMovies.currentFocusElementId <= 2) {
		// Carousel
		SceneMovies.currentFocusElementId = 3;
		SceneMovies.stopRotatingCarousel();
	} else {
		// Middle menu
		SceneMovies.currentFocusElementId = 0;
		SceneMovies.startRotatingCarousel();
	}
	SceneMovies.updateFocusElements();

};
SceneMovies.prototype.keyDownPress = function() {
	if (SceneMovies.currentFocusElementId <= 2) {
		// Carousel
		SceneMovies.currentFocusElementId = 3;
		SceneMovies.stopRotatingCarousel();
	} else {
		// Top menu
		SceneMovies.currentFocusElementId = 0;
		SceneMovies.startRotatingCarousel();
	}
	SceneMovies.updateFocusElements();
};
SceneMovies.prototype.keyEnterPress = function() {

	if (SceneMovies.isVideoPlaying) {
		SceneMovies.stopVideo();
		return;
	}

	switch (SceneMovies.currentFocusElementId) {
	case 0:
		// go back
		Controller.changeScene(AppData.previousScreen);
		AppData.previousScreen = 'Movies';
		break;
	case 1:
		// goto TV channels screen
		AppData.previousScreen = 'Movies';
		Controller.changeScene('TVchannels');
		break;
	case 2:
		// goto Musik screen
		break;
	case 3:
		// Carousel - select video to play
		SceneMovies.playVideo();
		// play video
		break;
	}
};
SceneMovies.prototype.keyHomePress = function() {
	Controller.changeScene('MainMenu');
};
SceneMovies.prototype.keyBackPress = function() {
	SceneMovies.stopVideo();
	// go back
	Controller.changeScene(AppData.previousScreen);
	AppData.previousScreen = 'Movies';
};
SceneMovies.prototype.keyPausePress = function() {
	// exit playing the video

	if (SceneMovies.isVideoPlaying) {
		SceneMovies.playPauseVideo();
		return;
	}

};

SceneMovies.prototype.handleKeyDown = function(keyCode) {
	alert("SceneMovies.handleKeyDown(" + keyCode + ")");
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
	case sf.key.PAUSE:
		this.keyPausePress();
		break;
	}
};
SceneMovies.prototype.handleShow = function(data) {
	alert("SceneMovies.handleShow()");
};

SceneMovies.prototype.handleHide = function() {
	alert("SceneMovies.handleHide()");
};

SceneMovies.prototype.handleFocus = function() {
	alert("SceneMovies.handleFocus()");
	if (SceneMovies.carousel) {
		// Parsing the xml and adding images to html page
		SceneMovies.ParseXML("XML/Movies_carousel.xml");

		SceneMovies.updateFocusElements();

		SceneMovies.updateTextFields();

	}
};

SceneMovies.prototype.handleBlur = function() {
	alert("SceneMovies.handleBlur()");
};

// getting the absolute path here
getAbsPath = function(linkString) {
	var Abs_path = "";
	var rootPath = window.location.href.substring(0, location.href
			.lastIndexOf("/") + 1);
	// For 2012 platform
	if (unescape(window.location.toString()).indexOf("localhost") == -1) {
		if (unescape(window.location.toString()).indexOf("file://C") != -1) { // For
																				// PC-SDK
			Abs_path = unescape(rootPath).split("file://")[1].replace("C/",
					"C:/")
					+ linkString;
		} else { // For Real-Device
			Abs_path = unescape(rootPath).split("file://")[1] + linkString;
		}
	} else // For 2010, 2011 platform
	{
		if (unescape(window.location.toString()).indexOf("C:") != -1) {
			// For PC-SDK
			Abs_path = "/"
					+ unescape(rootPath).split("file://localhost/C:\\")[1]
							.replace(/\\/g, "/") + linkString;
			alert("**************Abs_path 2011***********" + Abs_path);
		} else {
			// For Real-Device
			Abs_path = "/" + unescape(rootPath).split("file://localhost/")[1]
					+ linkString;
		}
	}
	return Abs_path;
}