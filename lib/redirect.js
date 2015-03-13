function redirect_init() {
   console.log(location);
   localStorage.setItem("hash", location.hash);
   var clientInfo = JSON.parse(localStorage.getItem('clientInfo'));
   // Lookup the hash fragment, get and store the access token into local storage
   console.log("in redirect.js... clientInfo: " + clientInfo);
   // Then invoke the original callback function
   var status = opener.eval(clientInfo.callback_function)();
   // Finally, close the current popup window
   // On failure, log the error and still close the current popup window
   console.log(status);
   window.close();
}

redirect_init();