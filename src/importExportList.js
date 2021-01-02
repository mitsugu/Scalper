function exportList() {
  var strList = localStorage.qd_blacklist_on_amazon;
  var strListData = JSON.stringify(strList);
  var blob=new Blob([strListData],{type:"text/plan"});
  var link=document.createElement('a');
  link.href=URL.createObjectURL(blob);
  link.download='blacklist.json';
  link.click();
}

function importList(str) {
  localStorage.qd_blacklist_on_amazon = str;
}

chrome.runtime.onMessage.addListener(
  function(request,sender,sendResponse){
    if(request.request=="Export Scalper List") {
      exportList();
    } else if(request.request=="Import Scalper List") {
      importList(request.list);
    }
    sendResponse(true);
    return true;
  }
);

