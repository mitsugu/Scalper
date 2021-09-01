function evaluateXPath(aExpr,aNode) {
  // {{{strExpr
  // var elms=evaluateXPath(documentNode, '//myns:entry');
  // See URL for xpath expressions
  // https://developer.mozilla.org/ja/docs/Web/XPath/Introduction_to_using_XPath_in_JavaScript#implementing_a_user_defined_namespace_resolver
  let result = aNode.evaluate(
    aExpr,
    aNode,
    null,
    XPathResult.ANY_TYPE,
    null
  );

  let found = [];
  let res;
  while (res = result.iterateNext()){
    found.push(res);
  }
  return found;
  // }}}
}

function getPrice(sellerCode) {
  // {{{
  let ret = "";
  let strExpr = "//a[contains(@href,'seller="+sellerCode+"') and @aria-label='新しいページを開く']/../../../../..";
  let elms = evaluateXPath(strExpr,document);
  switch(elms.length) {
    case 1:
      strExpr = "//a[contains(@href,'seller="+sellerCode+"') and @aria-label='新しいページを開く']/../../../../../div[@id='aod-offer-price']//span[@class='a-price-whole']/text()";
      elms = evaluateXPath(strExpr,document);
      if(elms.length>0){
        ret = elms[0].nodeValue.replace(",","");
      }else{
        ret = "";
      }
      break;
   default:
      strExpr = "//div[@id='all-offers-display']//div[@id='all-offers-display-scroller']//div[@id='aod-container']//div[@id='aod-pinned-offer']//div[@id='pinned-offer-top-id']//div[contains(@id,'aod-price')]//span[@class='a-price-whole']/text()";
      elms = evaluateXPath(strExpr,document);
      if (elms.length>0 ){
        ret = elms[0].nodeValue.replace(",","");
      } else {
        ret = "";
      }
      break;
  }
  return ret;
  // }}}
}

function saveLocalStorage(data){
  // {{{
  browser.storage.local.get("keySellerData")
  .then(result => {
    let dataList = [];
    if(Object.keys(result).length>0){
      dataList = JSON.parse(result.keySellerData);
      let sts = dataList.find(element => (element.asin==data.asin)&&(element.sellerCode==data.sellerCode));
      if (!sts){
        dataList.push(data);
        browser.storage.local.set({"keySellerData":JSON.stringify(dataList)});
      }
    }else{
      dataList.push(data);
      browser.storage.local.set({"keySellerData":JSON.stringify(dataList)});
    }
  }).catch(err =>{
    console.error("error : "+err);
  });
  // }}}
}

function exportSellerData(){
  // {{{
  browser.storage.local.get("keySellerData")
  .then(result => {
    if(Object.keys(result).length>0){
      const BASE_NAME = 'sellerdata-';
      const EXTENSION_NAME = '.json';
      let fullDate  = new Date();
      let strYear   = fullDate.getFullYear().toString();
      let month     = fullDate.getMonth()+1;
      let strMonth  = (month>9)?month.toString():'0'+month.toString();
      let day       = fullDate.getDate();
      let strDay    = (day>9)?day.toString():'0'+day.toString();
      let hour      = fullDate.getHours();
      let strHour   = (hour>9)?hour.toString():'0'+hour.toString();
      let minutes   = fullDate.getMinutes();
      let strMin    = (minutes>9)?minutes.toString():'0'+minutes.toString();
      let seconds   = fullDate.getSeconds();
      let strSec    = (seconds>9)?seconds.toString():'0'+seconds.toString();
      let data      = result.keySellerData;

      let blob      = new Blob([data],{type:"text/plan"});
      let link      = document.createElement('a');
      link.href     = URL.createObjectURL(blob);
      link.download = BASE_NAME+strYear+strMonth+strDay+"-"
                      +strHour+strMin+strSec+EXTENSION_NAME;
      link.click();
    }
  }).catch(err => {
    console.error(err);
  });
  // }}}
}

browser.runtime.onMessage.addListener(
  // {{{
  function(request,sender,sendResponse){
console.log(request);
    if(request.command=="collectSeller") {
      let price = getPrice(request.sellerCode);
      request.price = price;
      saveLocalStorage(request);
    }else if(request.command=="exportSellerData") {
      exportSellerData();
    }
    sendResponse(true);
    return true;
  }
  //}}}
);

