function randomQuote(jsonObj) {
  var quoteObj = jsonObj.table.rows;
  var quoteIndex = Math.floor(Math.random() * quoteObj.length);
  var parentElement = document.getElementById('homepage-quote');
  // Deleting any existing elements
  while (parentElement.firstChild) {
    parentElement.removeChild(parentElement.firstChild);
  }
  var blockquote = document.createElement('blockquote');
  var text = document.createTextNode(quoteObj[quoteIndex].c[0].v);
  blockquote.appendChild(text);
  var span = document.createElement('span');
  var text = document.createTextNode('- ' + quoteObj[quoteIndex].c[1].v);
  span.appendChild(text);
  blockquote.appendChild(span);
  parentElement.appendChild(blockquote);
  parentElement.style.display = "block";
}
