function mergeScalperList(e) {
  // {{{
  e.preventDefault();
  console.log('mergeScalperList(e)')
  let strInputList = document.querySelector("#listofscalper").value;
  var inputArr;
  try{
    inputArr = JSON.parse(strInputList);
    let gettingItem = browser.storage.local.get("keyScalperList");
    gettingItem.then((result) => {
      let storeList = result.keyScalperList;
      let storeArr = JSON.parse(storeList);
      let mergeArr = Array.from(new Set(storeArr.concat(inputArr)));
      browser.storage.local.set({
        "keyScalperList": JSON.stringify(mergeArr)
      }).then(
        function(){
          console.log('Success restore Scalper List');
        },
        function(){
          console.error("Error: ${error}");
        }
      );
    }).catch((error) => {
      error.preventDefault();
    });
  }catch(e){
    console.log('merge csv file');
    let lastIndexCR = strInputList.lastIndexOf("\n");
    let tmp = "[\""
            + strInputList.substring(0,lastIndexCR).replaceAll('\n','\",\"')
            + "\"]";
    inputArr = JSON.parse(tmp);
    let gettingItem = browser.storage.local.get("keyScalperList");
    gettingItem.then((result) => {
      let storeList = result.keyScalperList;
      let storeArr = JSON.parse(storeList);
      let mergeArr = Array.from(new Set(storeArr.concat(inputArr)));
      console.clear();
      console.log(mergeArr.length);
      console.log(mergeArr);
      browser.storage.local.set({
        "keyScalperList": JSON.stringify(mergeArr)
      }).then(
        function(){
          console.log('Success merge Scalper List');
        },
        function(){
        }
      );
    }).catch((error) => {
      error.preventDefault();
    });
  }
  // }}}
}

function restoreScalperList(e) {
  // {{{
  e.preventDefault();
  let ScalperList = document.querySelector("#listofscalper").value;
  try{
    let tmp = JSON.parse(ScalperList);
    browser.storage.local.set({
      "keyScalperList":ScalperList
    }).then(
      function(){
        console.clear();
        console.log('Success restore Scalper List');
      },
      function(){
      }
    );
  }catch(e){
    let lastIndexCR = ScalperList.lastIndexOf("\n");
    let tmp = "[\""
            + ScalperList.substring(0,lastIndexCR).replaceAll('\n','\",\"')
            + "\"]";
    browser.storage.local.set({
      "keyScalperList":tmp
    }).then(
      function(){
        console.clear();
        console.log('Success restore Scalper List');
      },
      function(){
      }
    );
  }
  // }}}
}

function restoreSeller() {
  // {{{
  let strData = document.querySelector("#dataofseller").value;
  let tmp = JSON.stringify(JSON.parse(strData));
  console.log(tmp);
  browser.storage.local.set({"keySellerData":tmp});
  // }}}
}

function mergeSeller() {
  // {{{
  let inputArr, storeArr;
  inputArr = JSON.parse(document.querySelector("#dataofseller").value);
  browser.storage.local.get("keySellerData")
  .then(result => {
    storeArr=JSON.parse(result.keySellerData);
    // オブジェクトの配列のマージ
    inputArr.forEach(elm => {
      let sts = storeArr.find(element => (element.asin==elm.asin)&&(element.sellerCode==elm.sellerCode));
      if (!sts) storeArr.push(elm);
    });
    browser.storage.local.set({"keySellerData": JSON.stringify(storeArr)});
  });
  // }}}
}

function clearSeller(){
  browser.storage.local.remove("keySellerData");
}

// {{{
document.querySelector("#form").addEventListener("submit", this.restoreScalperList);
document.querySelector("#merge").addEventListener("click", this.mergeScalperList);
document.querySelector("#restoreseller").addEventListener("click", this.restoreSeller);
document.querySelector("#mergeseller").addEventListener("click", this.mergeSeller);
document.querySelector("#clearseller").addEventListener("click", this.clearSeller);
// }}}

