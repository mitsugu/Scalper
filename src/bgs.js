(function(){
  var strScalperList;
  var tabId;

  function setTabId(tabs) {
    if(tabs.length>0) {
      tabId = tabs[0].id;
    }
  }

  function onError(error) {
    console.error("Error: ${error}");
  }

  var querying = browser.tabs.query({url: "https://*.amazon.co.jp/*"});
  querying.then(setTabId, onError);

  function sendListMessageToTab() {
    browser.tabs.sendMessage(
      tabId,
      {
        request:"Import Scalper List",
        list : strScalperList
      },
      function(response){
      }
    );
  }

  browser.storage.onChanged.addListener(changeData => {
    strScalperList = changeData.ScalperList.newValue;
    sendListMessageToTab();
  });

  function sendMessageToTabs() {
    browser.tabs.sendMessage(
      tabID,
      {request:"Export Scalper List"},
      function(response){
      }
    );
  }

  browser.menus.create({
    "id" : "export-list",
    "title":"Export Scalper List",
    "type":"normal",
    "contexts":["all"],
    "documentUrlPatterns":["https://www.amazon.co.jp/*"],
    "onclick":function(){
      sendMessageToTabs();
    }
  });
})();

