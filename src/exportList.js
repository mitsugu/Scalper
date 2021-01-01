function exportList() {
  var strList=localStorage.qd_blacklist_on_amazon;
  var blob=new Blob([strList],{type:"text/plan"});
  var link=document.createElement('a');
  link.href=URL.createObjectURL(blob);
  link.download='blacklist.json';
  link.click();
}

(function(){
  chrome.runtime.onMessage.addListener(
    function(request,sender,sendResponse){
      if(request.request=="Export Scalper List") {
        exportList();
      }
      sendResponse(true);
      return true;
    }
  );
})();

