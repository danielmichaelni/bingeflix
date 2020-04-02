chrome.webNavigation.onHistoryStateUpdated.addListener(details => {
  const { tabId, url } = details;
  if (url.includes("https://www.netflix.com/watch/")) {
    chrome.tabs.executeScript(tabId, { file: "binge.js" });
  }
});
