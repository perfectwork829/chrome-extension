/**
 * written by Dzmitry P.  2022.06.29
 */

try {
    importScripts('/js/config.js', '/js/common.js');
} catch (e) {
    console.error(e);
}

let localStorage = {
    auth: {}
};


chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if(request.msg == "login") {
        localStorage.auth = request.auth;
    }
});

// Event triggered when user open new tab
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {   
    
    // If empty url or undefined, ignore event
    if(tab.url === undefined || tab.url.indexOf("chrome://") >= 0 || !tab.url.indexOf("chrome-extension://") || tab.url == 'about:blank') 
        return;
    console.log(localStorage.auth.authUser);
    if(localStorage.auth.authUser == undefined) return;

    let title;
    if(changeInfo.title !== undefined)
        title = changeInfo.title;

    if(changeInfo.status === "complete" && tab.active === true)
    {
        var jsonObj = {
            tabId: tabId,
            title: tab.title,
            tabUrl: tab.url,
            userId: localStorage.auth.authUser.id
        };

        fetch(DATA_ENV.appUrl + "/insertTab", {
            method: 'POST', // *GET, POST, PUT, DELETE, etc.
            mode: 'cors', // no-cors, *cors, same-origin
            cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            credentials: 'same-origin', // include, *same-origin, omit
            headers: {
              'Content-Type': 'application/json'
              // 'Content-Type': 'application/x-www-form-urlencoded',
            },
            redirect: 'follow', // manual, *follow, error
            referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
            body: JSON.stringify(jsonObj) // body data type must match "Content-Type" header
          }).then(response => {});
    }
});

// Event triggered when user close the tab
chrome.tabs.onRemoved.addListener(function(tabId) {
    var jsonObj = {
        tabId: tabId
    };

    fetch(DATA_ENV.appUrl + "/closeTab", {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, *cors, same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'same-origin', // include, *same-origin, omit
        headers: {
          'Content-Type': 'application/json'
          // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        redirect: 'follow', // manual, *follow, error
        referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        body: JSON.stringify(jsonObj) // body data type must match "Content-Type" header
      }).then(response => {});
});

chrome.runtime.onStartup.addListener(function() {
    console.log("Start UP");
});
