function exportList() {
  let gettingItem = browser.storage.local.get("keyScalperList");
  gettingItem.then((result) => {
    let strListData = result.keyScalperList;
    const BASE_NAME = 'blacklist';
    const EXTENSION_NAME = '.json';
    let fullDate    = new Date();
    let strYear     = fullDate.getFullYear().toString();
    let month       = fullDate.getMonth()+1;
    let strMonth    = (month>9) ? month.toString() : '0' + month.toString();
    let day         = fullDate.getDate();
    let strDay      = (day>9) ? day.toString() : '0'+day.toString();

    let blob=new Blob([strListData],{type:"text/plan"});
    let link=document.createElement('a');
    link.href=URL.createObjectURL(blob);
    link.download=BASE_NAME+'-'+strYear+'-'+strMonth+'-'+strDay+EXTENSION_NAME;
    link.click();
  }).catch((error) => {
    console.error("Error: ${error}");
  });
}

chrome.runtime.onMessage.addListener(
  function(request,sender,sendResponse){
    if(request.request=="Export Scalper List") exportList();
    sendResponse(true);
    return true;
  }
);

