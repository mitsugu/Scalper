function exportList() {
  const BASE_NAME = 'blacklist';
  const EXTENSION_NAME = '.json';
  let fullDate  = new Date();
  let strYear   = fullDate.getFullYear().toString();
  let month     = fullDate.getMonth()+1;
  let strMonth  = (month>9) ? month.toString() : '0' + month.toString();
  let day       = fullDate.getDate();
  let strDay    = (day>9) ? day.toString() : '0'+day.toString();
  let strList   = localStorage.qd_blacklist_on_amazon;
  let strListData = strList;
  let blob=new Blob([strListData],{type:"text/plan"});
  let link=document.createElement('a');
  link.href=URL.createObjectURL(blob);
  link.download=BASE_NAME+'-'+strYear+'-'+strMonth+'-'+strDay+EXTENSION_NAME;
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

