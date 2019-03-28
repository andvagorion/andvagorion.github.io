(function(){
    var oldLog = console.log;
    console.log = function (message) {
        document.body.innerHTML += message + '\r\n';
        oldLog.apply(console, arguments);
    };
})();
