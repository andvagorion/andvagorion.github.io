(function(){
    var oldLog = console.log;
    console.log = function (message) {
        document.body.innerHTML += message + '<br/>';
        oldLog.apply(console, arguments);
    };
})();
