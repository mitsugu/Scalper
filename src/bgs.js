(function(){
  function onError(error) {
    console.error("Error: ${error}");
  }

  function sendMessageToTabs(tabs) {
    console.log( tabs );
    browser.tabs.sendMessage(
      tabs[0].id,
      {request:"Export Scalper List"},
      function(response){
      }
    );
  }

  browser.menus.create(
    {
      "id" : "export-list",
      "title":"Export Scalper List",
      "type":"normal",
      "contexts":["all"],
      "documentUrlPatterns":["https://www.amazon.co.jp/*"],
      "onclick":function(){
        browser.tabs.query({
          currentWindow: true,
          active: true
        }).then(sendMessageToTabs).catch(onError);
      }
    }
  );
})();

