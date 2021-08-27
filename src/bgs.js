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
  // {{{
  browser.tabs.query({active: true, currentWindow: true})
  .then(data => {
    if(data.length==1){
      let code = info.linkUrl.match(/seller=.*/)[0].replace("seller=","");
      code = code.substring(0,code.indexOf("&"));

      browser.tabs.sendMessage(
        data[0].id,
        {
          "command"     : "setScalper",
          "scalperCode" : code
        }
      ).then(response => {});
    }
  }).catch((error) => {
    console.error("Error: ${error}");
  });
  // }}}
}

function getSellerCode(info) {
  // {{{
  let code = info.linkUrl.match(/seller=.*/)[0].replace("seller=","");
  code = code.substring(0,code.indexOf("&"));
  return code;
  // }}}
}

function getAsin(info) {
  // {{{
  let asin = info.linkUrl.match(/asin=.*/)[0].replace("asin=","");
  asin = asin.substring(0,asin.indexOf("&"));
  return asin;
  // }}}
}

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

function editAddress(elm){
  // {{{
  let tmp = [];
  let max = elm.childNodes.item(0).childNodes.item(1).childNodes.length;
  for(let i=max;i>0;i--){
    tmp.push(elm.childNodes.item(0).childNodes.item(1).childNodes.item(i-1).firstChild.firstChild.textContent);
  }
  tmp.shift();
  return tmp.join().replace(/\,/g," ");
  // }}}
}

function getSellerAttribute(strDoc) {
  // {{{
  let ret = {};
  let dp = new DOMParser();
  let elms = evaluateXPath(
    "//div[@id='seller-profile-container']//h3[@id='-component-heading']/following-sibling::ul/li",
    dp.parseFromString(strDoc,"text/html")
  );
  console.log(elms);
  for(let i=0;i<elms.length;i++){
    if(elms[i].textContent.match(/販売業者/i)!==null){
      ret.name = elms[i].textContent.replace("販売業者:","");
    }else if(elms[i].textContent.match(/電話番号/i)!==null){
      ret.tel = elms[i].textContent.replace("お問い合わせ先電話番号:","");
    }else if(elms[i].textContent.match(/運営責任者名/i)!==null){
      ret.resp = elms[i].textContent.replace("運営責任者名:","");
    }else if(elms[i].textContent.match(/店舗名/i)!==null){
      ret.store = elms[i].textContent.replace("店舗名:","");
    }else if(elms[i].textContent.match(/住所/i)!==null){
      ret.addr = editAddress(elms[i]);
    }else{
      console.error(elms[i]);
    }
  }
  return ret;
  // }}}
}

function rebuildUrl(url){
  // {{{
  const fragment1 = "https://www.amazon.co.jp/sp?_encoding=UTF8&asin=";
  const fragment2 = "&isAmazonFulfilled=1&ref_=olp_merch_name_2&seller=";
  let code = url.match(/seller=.*/)[0].replace("seller=","");
  code = code.substring(0,code.indexOf("&"));
  let asin = url.match(/asin=.*/)[0].replace("asin=","");
  asin = asin.substring(0,asin.indexOf("&"));
  url = fragment1+asin+fragment2+code;

  return url;
  // }}}
}

function getSellerData(url){
  // {{{
  return (new Promise((resolve, reject) => {
    fetch(rebuildUrl(url))
      .then(response => response.text())
      .then(data => {
        resolve(getSellerAttribute(data));
      }).catch(err => {
        reject("Can't get seller data : "+err);
      });
  }));
  // }}}
}

function collectSeller(info){
  // {{{
  getSellerData(info.linkUrl)
  .then(sellerData => {
    browser.tabs.query({active: true, currentWindow: true})
    .then(data => {
      if(data.length==1){
        browser.tabs.query({active: true, lastFocusedWindow: true})
        .then(res => {
          browser.tabs.sendMessage(
            res[0].id,
            {
              "command"         : "collectSeller",
              "asin"            : getAsin(info),
              "sellerCode"      : getSellerCode(info),
              "distributorName" : sellerData.name,
              "tel"             : sellerData.tel,
              "addr"            : sellerData.addr,
              "resp"            : sellerData.resp,
              "store"           : sellerData.store,
              "linkText"        : info.linkText,
              "linkUrl"         : info.linkUrl,
              "pageUrl"         : info.pageUrl,
              "targetElementId" : info.targetElementId
            }
          ).then(response => {});
        });
      }
    });
  }).catch(err => {
    console.error("Error: "+err);
  });
  // }}}
}

function exportSellerData(){
  // {{{
  browser.tabs.query({active: true, currentWindow: true})
  .then(data => {
    if(data.length==1){
      browser.tabs.sendMessage(data[0].id,{"command":"exportSellerData"})
      .then(response => {});
    }
  }).catch((error) => {
    console.error("Error: ${error}");
  });
  // }}}
}

// {{{
browser.menus.create({
  "id"                  : "scalper-manager",
  "title"               : "&Scalper Manager",
  "type"                : "normal",
  "contexts"            : ["all"],
  "documentUrlPatterns" : ["https://www.amazon.co.jp/*"]
});

browser.menus.create({
  "id"                  : "toggle-scalper",
  "parentId"            : "scalper-manager",
  "title"               : "&Toggle Scalper's Mark",
  "type"                : "normal",
  "contexts"            : ["link"],
  "documentUrlPatterns" : ["https://www.amazon.co.jp/*"],
  "onclick"             : function(info){
    toggleScalper(info);
  }
});

browser.menus.create({
  "id"                  : "collect-seller",
  "parentId"            : "scalper-manager",
  "title"               : "&Collect sellers",
  "type"                : "normal",
  "contexts"            : ["link"],
  "documentUrlPatterns" : ["https://www.amazon.co.jp/*"],
  "onclick"             : function(info){
    collectSeller(info);
  }
});

browser.menus.create({
  "id"                  : "export-list",
  "parentId"            : "scalper-manager",
  "title"               : "&Backup Scalper List",
  "type"                : "normal",
  "contexts"            : ["all"],
  "documentUrlPatterns" : ["https://www.amazon.co.jp/*"],
  "onclick"             : function(){
    getTabId();
  }
});

browser.menus.create({
  "id"                  : "export-seller",
  "parentId"            : "scalper-manager",
  "title"               : "&Export Seller Data",
  "type"                : "normal",
  "contexts"            : ["all"],
  "documentUrlPatterns" : ["https://www.amazon.co.jp/*"],
  "onclick"             : function(){
    exportSellerData();
  }
});

// }}}

