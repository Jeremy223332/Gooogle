chrome.webRequest.onErrorOccurred.addListener(
  (details) => {
    // Only target main browser page navigations
    if (details.type !== "main_frame") return;

    const targetErrors = [
      "net::ERR_INTERNET_DISCONNECTED",
      "net::ERR_CONNECTION_REFUSED",
      "net::ERR_CONNECTION_RESET",
      "net::ERR_NAME_NOT_RESOLVED",
      "net::ERR_CONNECTION_TIMED_OUT"
    ];

    if (targetErrors.includes(details.error)) {
      const customPage = chrome.runtime.getURL("offline.html");
      
      if (!details.url.startsWith(customPage)) {
        chrome.tabs.update(details.tabId, {
          url: `${customPage}?failedUrl=${encodeURIComponent(details.url)}&error=${encodeURIComponent(details.error)}`
        });
      }
    }
  },
  { urls: ["<all_urls>"] }
);
