chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.contentScriptQuery == 'RequestUrl') {
    console.log(request.url);

    fetch(request.url)
      .then(response => response.text())
      .then(text => sendResponse(text))
      .catch(error => console.log(error));
    return true;
  }
});
