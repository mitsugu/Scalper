function importScalperList(e) {
  let ScalperList = document.querySelector("#listofscalper").value;
  browser.storage.local.set(
    {"keyScalperList":ScalperList}
  );
  e.preventDefault();
}
document.querySelector("#form").addEventListener("submit", this.importScalperList);

