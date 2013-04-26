function onStart() {
    var arrPathToIncluded = new Array();

    arrPathToIncluded.push('app/Controller.js');

    sf.core.loadJS(arrPathToIncluded, function(){
        Controller.initialize();
        Controller.start();
    });
}

function onDestroy () {
	//
}