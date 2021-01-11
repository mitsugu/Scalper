function mergeScalperList(e) {
  let gettingItem = browser.storage.local.get("keyScalperList");
  gettingItem.then((result) => {
    let strListData = result.keyScalperList;
    let oldArr = JSON.parse(strListData);
    let strInputList = document.querySelector("#listofscalper").value;
    let inputArr = JSON.parse(strInputList);
    let targetArr = Array.from(new Set(oldArr.concat(inputArr)));
    browser.storage.local.set(
      {"keyScalperList": JSON.stringify(targetArr)}
    );
  }).catch((error) => {
    importScalperList(error);
  });
}

function importScalperList(e) {
  let ScalperList = document.querySelector("#listofscalper").value;
  browser.storage.local.set(
    {"keyScalperList":ScalperList}
  );
  e.preventDefault();
}
document.querySelector("#form").addEventListener("submit", this.importScalperList);
document.querySelector("#merge").addEventListener("click", this.mergeScalperList);

