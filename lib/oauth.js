var clientInfo;

function init(obj) {
   clientInfo = obj;
}

function login() {
   // launch Imgur OAuth flow in new popup window
   var url = "https://api.imgur.com/oauth2/authorize?client_id=" + clientInfo.client_id + "&response_type=" + clientInfo.type + "&state=APPLICATION_STATE";
   $(window.open(url, "Imgur Login", "height=800, width=500"));
}
