function onStart() {
    var arrPathToIncluded = new Array();

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