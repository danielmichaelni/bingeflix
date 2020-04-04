function injectHelper() {
  const body = document.getElementsByTagName("body")[0];
  const script = document.createElement("script");
  script.setAttribute("type", "text/javascript");
  script.setAttribute("src", chrome.extension.getURL("helper.js"));
  body.appendChild(script);
}

function createSkipIntroObserver() {
  const skipIntroAttempt = () => {
    const skipIntroButton = document.querySelector(".skip-credits > a");
    if (skipIntroButton) {
      skipIntroButton.click();
    }
  };

  const target = document.querySelector(".PlayerControlsNeo__layout");
  if (!target) return setTimeout(createSkipIntroObserver, 200);

  const observer = new MutationObserver(skipIntroAttempt);

  chrome.storage.sync.get(
    { skipIntroEnabled: true },
    ({ skipIntroEnabled }) => {
      if (skipIntroEnabled) {
        observer.observe(target, { childList: true });
      }
    }
  );

  chrome.storage.onChanged.addListener(({ skipIntroEnabled }) => {
    if (!skipIntroEnabled) return;

    if (skipIntroEnabled.newValue) {
      observer.observe(target, { childList: true });
    } else {
      observer.disconnect();
    }
  });
}

function createNextEpisodeObserver() {
  const nextEpisodeAttempt = () => {
    document.dispatchEvent(new Event("nextEpisode"));
  };

  const target = document.querySelector(".PlayerControlsNeo__all-controls");
  if (!target) return setTimeout(createNextEpisodeObserver, 200);

  const observer = new MutationObserver(nextEpisodeAttempt);

  chrome.storage.sync.get(
    { nextEpisodeEnabled: true },
    ({ nextEpisodeEnabled }) => {
      if (nextEpisodeEnabled) {
        observer.observe(target, { childList: true });
      }
    }
  );

  chrome.storage.onChanged.addListener(({ nextEpisodeEnabled }) => {
    if (!nextEpisodeEnabled) return;

    if (nextEpisodeEnabled.newValue) {
      observer.observe(target, { childList: true });
    } else {
      observer.disconnect();
    }
  });
}

injectHelper();
createSkipIntroObserver();
createNextEpisodeObserver();
