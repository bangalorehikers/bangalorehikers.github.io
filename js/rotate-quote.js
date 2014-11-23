function rotateQuote(jsonObj) {
  var quoteObj = jsonObj.table.rows;
  var curQuoteIndex = -1;
  var intervalID = setInterval(function() {
    ++curQuoteIndex;
    if (curQuoteIndex >= quoteObj.length) {
      curQuoteIndex = 0;
    }
    setQuote(quoteObj[curQuoteIndex]);
  }, 10000);
}
function setQuote(jsonObj) {
  var parentElement = document.getElementById('homepage-quote');
  // Deleting any existing elements
  while (parentElement.firstChild) {
    parentElement.removeChild(parentElement.firstChild);
  }
  var blockquote = document.createElement('blockquote');
  var text = document.createTextNode(jsonObj.c[0].v);
  blockquote.appendChild(text);
  var span = document.createElement('span');
  var text = document.createTextNode('- ' + jsonObj.c[1].v);
  span.appendChild(text);
  blockquote.appendChild(span);
  parentElement.appendChild(blockquote);
}
var scr = document.createElement('script'); 
scr.type = 'text/javascript';
scr.src = 'https://spreadsheets.google.com/a/google.com/tq?key=1U5PVTsrjsdETTZYL6zgAszOiul4XbrXKqWcE24lXCAQ&tq=select%20A%2C%20B%20Offset%201&tqx=out:json;responseHandler:rotateQuote';
window.document.getElementsByTagName('head')[0].appendChild(scr);