function injectHelper() {
  const body = document.getElementsByTagName("body")[0];
  const script = document.createElement("script");
  script.setAttribute("type", "text/javascript");
  script.setAttribute("src", chrome.extension.getURL("helper.js"));
  body.appendChild(script);
}

function createObserver() {
  const target = document.querySelector("#appMountPoint");
  if (!target) return setTimeout(createObserver, 200);

  chrome.storage.sync.get(
    { skipIntroEnabled: true, nextEpisodeEnabled: true },
    ({ skipIntroEnabled, nextEpisodeEnabled }) => {
      let isSkipIntroEnabled = skipIntroEnabled;
      let isNextEpisodeEnabled = nextEpisodeEnabled;

      chrome.storage.onChanged.addListener(
        ({ skipIntroEnabled, nextEpisodeEnabled }) => {
          if (skipIntroEnabled) {
            isSkipIntroEnabled = skipIntroEnabled.newValue;
          }
          if (nextEpisodeEnabled) {
            isNextEpisodeEnabled = nextEpisodeEnabled.newValue;
          }
        }
      );

      const skipIntroAttempt = () => {
        const skipIntroButton = document.querySelector(".skip-credits > a");
        if (skipIntroButton) {
          skipIntroButton.click();
        }
      };

      const nextEpisodeAttempt = () => {
        document.dispatchEvent(new Event("nextEpisode"));
      };

      const observer = new MutationObserver(() => {
        if (isSkipIntroEnabled) {
          skipIntroAttempt();
        }
        if (isNextEpisodeEnabled) {
          nextEpisodeAttempt();
        }
      });
      observer.observe(target, { childList: true, subtree: true });
    }
  );
}

injectHelper();
createObserver();
