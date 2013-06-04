function onStart() {
	
	alert("Setting WatchDog On...");
	var pluginAPI = new Common.API.Plugin();
    pluginAPI.setOnWatchDog();
    alert("WatchDog is On!");

    var arrPathToIncluded = new Array();

    arrPathToIncluded.push('app/Data.js');
    arrPathToIncluded.push('app/AppData.js');
    arrPathToIncluded.push('app/Constants.js');
    arrPathToIncluded.push('app/Languages.js');
    arrPathToIncluded.push('app/Controller.js');

    sf.core.loadJS(arrPathToIncluded, function(){
        Controller.initialize();
        Controller.start();
    });
}

function onDestroy () {
	//
}