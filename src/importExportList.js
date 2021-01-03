function exportList() {
  var strList = localStorage.qd_blacklist_on_amazon;
  var strListData = strList;
  var blob=new Blob([strListData],{type:"text/plan"});
  var link=document.createElement('a');
  link.href=URL.createObjectURL(blob);
  link.download='blacklist.json';
  link.click();
}

chrome.runtime.onMessage.addListener(
  function(request,sender,sendResponse){
    if(request.request=="Export Scalper List") exportList();
    sendResponse(true);
    return true;
  }
);

function importList(str) {
  localStorage.qd_blacklist_on_amazon = str;
}

browser.storage.onChanged.addListener(changeData => {
  strScalperList = changeData.keyScalperList.newValue;
  importList(strScalperList);
});

function initialLoadLocalStorageData(str){
  localStorage.qd_blacklist_on_amazon = str;
}

function onError(error) {
  console.error("Error: ${error}");
}

function init() {
  let gettingItem = browser.storage.local.get(
    "keyScalperList"
  );
  gettingItem.then(initialLoadLocalStorageData, onError);
}

document.addEventListener('load', init);

