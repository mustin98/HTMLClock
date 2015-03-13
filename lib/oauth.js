function init(obj) {
   /* obj:
       client_id
       type
       callback_function */
   localStorage.setItem("clientInfo", JSON.stringify(obj));
}

function login() {
   var clientInfo = JSON.parse(localStorage.getItem("clientInfo"));
   console.log("in oauth.js... clientInfo obj: " + clientInfo);
   // launch Imgur OAuth flow in new popup window
   var url = "https://api.imgur.com/oauth2/authorize?client_id=" + clientInfo.client_id + "&response_type=" + clientInfo.type + "&state=APPLICATION_STATE";
   window.open(url, "Imgur Login", "height=800, width=500");
}

function callback () {
   console.log("CALLed BACK");
   var regex = /([^&=]+)=([^&]*)/g;
   var tokens = regex.exec(localStorage.getItem("hash"));
   var accessToken = tokens[tokens.length - 1];
   var url = "https://api.imgur.com/3/account/me";

   function setHeader(xhr) {
      xhr.setRequestHeader("Authorization", "Bearer " + accessToken);
   }

   $.ajax({
      url: url,
      type: "GET",
      dataType: "json",
      success: function (data) {
         alert("Logged in as: " + data.data.url); 
      },
      error: function (data) { 
         console.log(JSON.stringify(data));
         alert(JSON.stringify(data)); 
      },
      beforeSend: setHeader
   });
}