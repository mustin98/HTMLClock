function redirect_init() {
   // Lookup the hash fragment, get and store the access token into local storage
   localStorage.setItem('accessToken', location.hash);
   // Then invoke the original callback function
   var clientInfo = JSON.parse(localStorage.getItem('clientInfo'));
   var callback = clientInfo.callback_function;
   var status = opener.eval(callback)();
   // Finally, close the current popup window
   // On failure, log the error and still close the current popup window
   console.log(status);
   window.close();
}

redirect_init()