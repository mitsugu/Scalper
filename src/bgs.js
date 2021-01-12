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
  var querying = browser.tabs.query({url: "https://*.amazon.co.jp/*"});
  querying.then(setTabId, onError);
}

browser.menus.create({
  "id" : "scalper-manager",
  "title":"Scalper Manager",
  "type":"normal",
  "contexts":["all"],
  "documentUrlPatterns":["https://www.amazon.co.jp/*"]
});

browser.menus.create({
  "id" : "export-list",
  "parentId" : "scalper-manager",
  "title":"Backup Scalper List",
  "type":"normal",
  "contexts":["all"],
  "documentUrlPatterns":["https://www.amazon.co.jp/*"],
  "onclick":function(){
    getTabId();
  }
});

