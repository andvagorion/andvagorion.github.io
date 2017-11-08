
(function() {

  if ('serviceWorker' in navigator) {
    console.log('ServiceWorker registration in progress.');
    navigator.serviceWorker.register('worker.js').then(function() {
      console.log('ServiceWorker registration successful with scope: ', registration.scope);
    }, function(err) {
      console.log('ServiceWorker registration failed: ', err);
    });
  } else {
    console.log('ServiceWorker is not supported.');
  }

})();
