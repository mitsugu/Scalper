function sendMessageToTabs(id) {
  browser.tabs.sendMessage(
    id,
    {request:"Export Scalper List"},
    function(response){}
  );
}

function setTabId(tabs) {
  if(tabs.length>0)
    sendMessageToTabs(tabs[0].id);
}

function onError(error) {
  console.error("Error: ${error}");
}

function getTabId() {
  var querying = browser.tabs.query({active: true, currentWindow: true});
  querying.then(setTabId, onError);
}

function toggleScalper(info) {
  browser.tabs.query({active: true, currentWindow: true})
  .then(data => {
    if(data.length==1){
      let code = info.linkUrl.match(/seller=.*/)[0].replace("seller=","");
      code = code.substring(0,code.indexOf("&"));

      browser.tabs.query({active: true, lastFocusedWindow: true})
      .then(res => {
        browser.tabs.sendMessage(res[0].id, {"command":"setScalper","scalperCode":code})
        .then(response => {
          console.log(response);
        });
      });
    }
  }).catch((error) => {
    console.error("Error: ${error}");
  });
}

browser.menus.create({
  "id"                  : "scalper-manager",
  "title"               : "Scalper Manager",
  "type"                : "normal",
  "contexts"            : ["all"],
  "documentUrlPatterns" : ["https://www.amazon.co.jp/*"]
});

browser.menus.create({
  "id"                  : "toggle-scalper",
  "parentId"            : "scalper-manager",
  "title"               : "Toggle Scalper's Mark",
  "type"                : "normal",
  "contexts"            : ["link"],
  "documentUrlPatterns" : ["https://www.amazon.co.jp/*"],
  "onclick"             : function(info){
    toggleScalper(info);
  }
});

browser.menus.create({
  "id"                  : "export-list",
  "parentId"            : "scalper-manager",
  "title"               : "Backup Scalper List",
  "type"                : "normal",
  "contexts"            : ["all"],
  "documentUrlPatterns" : ["https://www.amazon.co.jp/*"],
  "onclick"             : function(){
    getTabId();
  }
});

