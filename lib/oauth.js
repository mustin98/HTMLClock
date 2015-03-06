function init(obj) {
   console.log(obj);
   localStorage.setItem("clientInfo", obj);
   console.log(localStorage.getItem("clientInfo").client_id);
}

function login() {
   // launch Imgur OAuth flow in new popup window
   var clientInfo = localStorage.getItem("clientInfo");
   console.log(clientInfo.client_id);
   var url = "https://api.imgur.com/oauth2/authorize?client_id=" + clientInfo.client_id + "&response_type=" + clientInfo.type + "&state=APPLICATION_STATE";
   var popup = window.open(url, "Imgur Login", "height=800, width=500");
}

function callback () {
  console.log("calling back");
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
      console.log("Logged in: " + data.data.url); 
    },
    error: function (data) { 
      console.log(JSON.stringify(data));
    },
    beforeSend: setHeader
  });
}