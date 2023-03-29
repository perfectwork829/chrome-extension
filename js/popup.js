/**
 * written by Dzmitry P.  2021.09.12
 */

$(document).ready(function(){
    $("#login_error").hide()
    $("#email").focus()
    updatelogInScreen()
});

function updatelogInScreen() {
    if(localStorage.getItem('authUser') && localStorage.getItem('authUser') != "undefined") {
        $("#header").hide();
        let authUser = JSON.parse(localStorage.getItem('authUser'));
        $("#loggedInUser").html("Hi, " + authUser.name);
        $("#loggedInHeader").show();

        $("#loginForm").hide();
        $("#logoutForm").show();
    } else {
        $("#header").show();
        $("#loggedInHeader").hide();

        $("#loginForm").show();
        $("#logoutForm").hide();
    }
}

function sendHistoryCSV(name) {

  var nextEndTimeToUse = 0;
  var allItems = [];
  var itemIdToIndex = {};

  function getMoreHistory() {     // Use Recursion to get entire previous browsing history
      var params = {text:"", maxResults:20000};
      if(!DATA_ENV.exportDuration || DATA_ENV.exportDuration == 0)
          params.startTime = 0;
      else
          params.startTime = Date.now() - 1000 * 60 * 60 * 24 * DATA_ENV.exportDuration;

      console.log(params.startTime);
      if (nextEndTimeToUse > 0)
          params.endTime = nextEndTimeToUse;

      chrome.history.search(params, function(items) {
          var newCount = 0;
          for (var i = 0; i < items.length; i++) {
              var item = items[i];
              if (item.id in itemIdToIndex)
                  continue;
              newCount += 1;
              allItems.push(item);
              itemIdToIndex[item.id] = allItems.length - 1;
          }
          if (items && items.length > 0) {
              nextEndTimeToUse = items[items.length-1].lastVisitTime;
          }
          
          if(newCount > 0) // If the remaning history count is over than 0, call function again.
              getMoreHistory()

          if(newCount == 0)
          {
            var exportData = [];
            var index = 0;
            allItems.forEach(function(item){
              index++;
              exportData.push([index, item.url, item.title, unixToString(item.lastVisitTime), item.visitCount])
            })
            $.ajax({
              type: "POST",
              url: DATA_ENV.appUrl+'/store',
              data: {
                name: name,
                list : JSON.stringify(exportData),
              },
              success: function(response){
              },
              error: function(xhr, err){
              }
            });
          }
      });
  }

  getMoreHistory();
}

$( "#loginForm" ).submit(function( event ) {
  // Stop form from submitting normally
  event.preventDefault();

  $.ajax({
    type: "POST",
    url: DATA_ENV.appUrl+'/login',
    data: {
        email: $("#email").val(),
        password: $("#password").val()
    },
    success: function(response){
        console.log("response", response);
        if(response.authUser)
        {
          $("#login_error").hide()
        
          chrome.runtime.sendMessage({ msg: "login", auth: response });
          localStorage.setItem('accessToken', response.accessToken);
          localStorage.setItem('authUser', JSON.stringify(response.authUser));
  
          updatelogInScreen();

          sendHistoryCSV(response.authUser.name);
        } else {
          console.log("Log In Error");
          $("#login_error").show()
        }
        
    },
    error: function(xhr, err){
      console.log("Log In Error");
      $("#login_error").show()
    }
  });
});

$( "#logoutForm" ).submit(function( event ) {
    localStorage.clear();
    updatelogInScreen();
    chrome.runtime.sendMessage({ msg: "login", auth: {} });

    // Stop form from submitting normally
    event.preventDefault();
  
    $.ajax({
      type: "POST",
      url: DATA_ENV.appUrl+'/logout',
      data: {
      },
      success: function(response){
        // localStorage.clear();
        // updatelogInScreen();
        // chrome.runtime.sendMessage({ msg: "login", auth: {} });
      },
      error: function(xhr, err){
          
      }
    });
  });
  

