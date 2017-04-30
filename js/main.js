"use strict";

$(document).foundation();
//var url = window.location.href;
//var hash = (url.split('#')[1]).replace("/", "");

var route = {
    url: window.location.href,
    hash: function () {
        var url = window.location.href;
        var toHash = "";
        if (url.indexOf("#") > -1) {
            toHash = (window.location.href.split('#')[1]).replace("/", "");
        }

        return toHash;
    }
};

var pages = {
    goTo: function (page) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', 'pages/' + page, true);
        xhr.onreadystatechange = function () {
            if (this.readyState !== 4)
                return;
            if (this.status !== 200)
                return;
            document.getElementsByTagName('interface')[0].innerHTML = this.responseText; 
            $("interface").foundation();
        };
        xhr.send();    
        console.log("load page: " + page);
    }
};

if (route.hash() !== "") {
    pages.goTo(route.hash());
}
/*
window.onhashchange = alert("asda");
//window.onhashchange = pages.goTo(route.hash());*/

var onHashChange = function (callback) {
    var __previousHash = null;
    var __callback = (typeof (callback) === "function") ? callback : null;

    /**
     * Check for existing hash, call the callback if there is any change
     * @param noCallback {Boolean} Indicate if the system should call the callback or not
     */
    this.checkHash = function (noCallback) {
        //Extracting hash, or null if there is nothing to extract
        var currentHash = (window.location.hash) ? window.location.hash.substring(1) : null;
        if (__previousHash !== currentHash) {
            if (__callback !== null && noCallback !== true) {
                __callback(currentHash, __previousHash);
            }
            __previousHash = currentHash;
        }
    }.bind(this);

    //Initiate the system
    this.checkHash(true);

    //The onhashchange exist in IE8 in compatibility mode, but does not work because it is disabled like IE7
    if (typeof (window.onhashchange) !== "undefined" && (document.documentMode === undefined || document.documentMode > 7)) {
        //Many browser support the onhashchange event, but not all of them
        window.onhashchange = this.checkHash;
    } else {
        //Starting manual function check, if there is no event to attach
        setInterval(this.checkHash, 500);
    }
};

window.onload = function () {
    new onHashChange(function (value, old) {
        //console.log("previous value : " + old);
        //console.log("new value : " + value);
        console.log("Detectado cambio en el hash.");
        pages.goTo(route.hash());
    });
};

var observeDOM = (function(){
    var MutationObserver = window.MutationObserver || window.WebKitMutationObserver,
        eventListenerSupported = window.addEventListener;

    return function(obj, callback){
        if( MutationObserver ){
            // define a new observer
            var obs = new MutationObserver(function(mutations, observer){
                if( mutations[0].addedNodes.length || mutations[0].removedNodes.length )
                    callback();
            });
            // have the observer observe foo for changes in children
            obs.observe( obj, { childList:true, subtree:true });
        }
        else if( eventListenerSupported ){
            obj.addEventListener('DOMNodeInserted', callback, false);
            obj.addEventListener('DOMNodeRemoved', callback, false);
        }
    };
})();

observeDOM( document.getElementsByTagName('interface')[0] ,function(){ 
    console.log('dom changed');
    if(document.getElementById("datatables_table")){
        $("#datatables_table").DataTable();
    }
});