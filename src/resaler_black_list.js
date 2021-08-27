ut1=Math.round((new Date()).getTime() / 1000); // ダブルクリック検知用

// 以下はコメントアウトされているのではなくて、
// 「Scalper」と表示を出すために使うCSSの雛形です */
var base_prime={};

base_prime['amazon']=(function() {/*
  [href],[data-a-popover]{
    opacity:.7;
  }

  [href]:before,[data-a-popover]:after{
    font-weight:900;
  }
*/}).toString().match(/[^]*\/\*([^]*)\*\/\}$/)[1];

var base={};
base['amazon']=(function() {/*
  [href*='[:id]'],[data-a-popover*='[:id]']{
    opacity:.7;
    padding:1em 0;
    padding-bottom:1.5em;
  }

  [href*='[:id]']:before,[data-a-popover*='[:id]']:after{
    content: 'Scalper' !important;
    font-size:1.2em !important;
    background: yellow;
    word-break: keep-all ;
    color:red;
  }
*/}).toString().match(/[^]*\/\*([^]*)\*\/\}$/)[1];

// urlのgetパラメータを取得します。
// 販売店のセラーIDをブラックリストに追加するのに必要
function getUrlVars(url){
  var vars = {};
  if(url){
    try{
      var param = url.split('?')[1].split('&');
    }catch(e){
      var params={};
    }
  }else{
    var param = location.search.substring(1).split('&');
  }
  try{
    for(var i = 0; i < param.length; i++) {
      var keySearch = param[i].search(/=/);
      var key = '';
      if(keySearch != -1) key = param[i].slice(0, keySearch);
      var val = param[i].slice(param[i].indexOf('=', 0) + 1);
      console.log(val);
      if(key != '') vars[key] = decodeURI(val);
    }
  }catch(e){
    console.warn(e);
    var vars={};
  }
  return vars;
}

// Scalperをマーキング
function qd_mark_resaler(ids,type){
  if(document.querySelector("#amazon_black_list")){
    var style=document.querySelector("#amazon_black_list");
  }else{
    var style=document.createElement("style");
    style.id="amazon_black_list";
  }
  // 上でスタイルタグを指定しています。
  // 重複しないようにタグがすでに挿入されている場合は再利用します */
  var style_string=base_prime[type];
  console.log(type,base[type])
  for(var i=0;i<ids.length;i++){
    style_string+=base[type].split("[:id]").join(ids[i]);
  }
  style.innerHTML=style_string;
  document.body.appendChild(style);
}

loaded=true;
var my_timer

// 配列のフィルタで使う関数
function is_in(target){
  return function(value){
    return (target==value);
  }
}

/*配列のフィルタで使う関数 */
function is_not_in(target){
  return function(value){
    return (target!=value);
  }
}

// ブラックリストで使う関数
function add_black_list(id){
  if(blackList.filter(is_in(id)).length==0){
    blackList.push(id);
    browser.storage.local.set({"keyScalperList":JSON.stringify(blackList)});
  }
}
ut1=0;

function black_list_switch(seller,type){
  if(blackList.indexOf(seller)<0){
    if(confirm("このセラーをブラックリストに追加しますか？")){
      blackList.push(seller);
      let jsonBlacklist=JSON.stringify(blackList);
      browser.storage.local.set({"keyScalperList":jsonBlacklist});
      qd_mark_resaler(JSON.parse(jsonBlacklist),type);
    }
  }else{
    if(confirm("このセラーをブラックリストから除外しますか？")){
      blackList.splice(blackList.indexOf(seller),1);
      let jsonBlacklist = JSON.stringify(blackList);
      browser.storage.local.set({"keyScalperList":jsonBlacklist});
      qd_mark_resaler(JSON.parse(jsonBlacklist),type);
    }
  }
}

var seller_id="";
function on_amazon(){
  // とりあえずScalperをマーキング
  qd_mark_resaler(blackList,'amazon');
  if(location.href.split("?")[0].split('/').length=='4'){
    var page=location.href.split("?")[0].split("=")[0].split('/')[3];
  }
  if(page=='sp'){
    // ショップの詳細ページを開いていた場合、リストの追加、削除を行う
    var items=getUrlVars();
    if(items.seller){ // PC 用
      seller_id=items.seller;
      var body = document.querySelector('body');
      body.addEventListener('dblclick', function (e) {
        black_list_switch(seller_id,'amazon');
      });
    }else if(items.s){/*スマホ用 */
      seller_id=items.s;
      var body = document.querySelector('body');
      body.addEventListener('dblclick', function (e) {
        black_list_switch(seller_id,'amazon');
      });
    }else{
      alert("セラーのIDが取得できませんでした。")
    }
  }
}

var type='';  // ここでどのサイト用のCSSを指定するか決める
function amazon_black_list(strBlockList){
  // ut=Math.round((new Date()).getTime() / 1000);
  // ブラックリストを読み出し
  blackList=[];
  try{
    blackList=JSON.parse(strBlockList);
  }catch(e){
    blackList=[];
  };

  if( location.href.indexOf("www.amazon") < 12
      && location.href.indexOf("www.amazon")!=-1){
    type='amazon';
    on_amazon();
    return false;
  }

/* {{{
  if( location.href.indexOf("www.mercari.com") < 12
      && location.href.indexOf("www.mercari.com")!=-1){
    type='mercari';
    on_mercari();
    return false;
  }
  if( location.href.indexOf("auctions.yahoo.co.jp") < 12
      && location.href.indexOf("auctions.yahoo.co.jp")!=-1){
    type='yahoo';
    on_yahoo();
    return false;
  }

  if( location.href.indexOf("page.auctions.yahoo.co.jp") < 12
      && location.href.indexOf("page.auctions.yahoo.co.jp")!=-1){
    alert('申し訳有りませんがこのページには対応しておりません。現在方法を考えているところです。');
    return false;
  }

  if( location.href.indexOf("item.rakuten.co.jp") < 12
      && location.href.indexOf("item.rakuten.co.jp")!=-1){
    type='rakuten';
    change_letter_code();
    on_rakuten_i();
    return false;
  }

  if( location.href.indexOf("search.rakuten.co.jp") < 12
      && location.href.indexOf("search.rakuten.co.jp")!=-1){
    type='rakuten';
    change_letter_code();
    on_rakuten_s();
    return false;
  }

  alert("現在対応しているのはメルカリ、アマゾン、ヤフーのみです")
}}} */

  alert("現在対応しているのはアマゾンのみです")
}

function init() {
  let gettingItem = browser.storage.local.get("keyScalperList");
  gettingItem.then((result) => {
    let jsonBlackList = result.keyScalperList;
    amazon_black_list(jsonBlackList);
  }).catch((error) => {
    console.error("Error: ${error}");
  });
}

// bgs.js 要求セラーコードトグル処理
browser.runtime.onMessage.addListener(
  // {{{
  function(request,sender,sendResponse){
    if(request.command=="setScalper"){
      black_list_switch(request.scalperCode,'amazon');
    }
    sendResponse("");
    return true;
  }
  // }}}
);

