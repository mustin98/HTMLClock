function redirect_init() {
   // Lookup the hash fragment, get and store the access token into local storage
   var params = {}, queryString = location.hash.substring(1),
    regex = /([^&=]+)=([^&]*)/g, m;
   while (m = regex.exec(queryString)) {
     params[decodeURIComponent(m[1])] = decodeURIComponent(m[2]);
   }
   console.log(params);
   localStorage.setItem("accessToken", params["access_token"]);
   // Then invoke the original callback function
   var status = opener.clientInfo.callback_function();
   // Finally, close the current popup window
   // On failure, log the error and still close the current popup window
   console.log(status);
   window.close();
}
