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

  chrome.storage.sync.get("skipIntroEnabled", ({ skipIntroEnabled }) => {
    if (skipIntroEnabled) {
      observer.observe(target, { childList: true });
    }
  });

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
    const nextEpisodeButton = document.querySelector(
      '[data-uia="next-episode-seamless-button"]'
    );
    if (nextEpisodeButton) {
      for (const key in nextEpisodeButton) {
        if (key.startsWith("__reactInternalInstance$")) {
          nextEpisodeButton[key].memoizedProps.onPointerDown(
            new PointerEvent("click")
          );
        }
      }
    }
  };

  const target = document.querySelector(".PlayerControlsNeo__all-controls");
  if (!target) return setTimeout(createNextEpisodeObserver, 200);

  const observer = new MutationObserver(nextEpisodeAttempt);

  chrome.storage.sync.get("nextEpisodeEnabled", ({ nextEpisodeEnabled }) => {
    if (nextEpisodeEnabled) {
      observer.observe(target, { childList: true });
    }
  });

  chrome.storage.onChanged.addListener(({ nextEpisodeEnabled }) => {
    if (!nextEpisodeEnabled) return;

    if (nextEpisodeEnabled.newValue) {
      observer.observe(target, { childList: true });
    } else {
      observer.disconnect();
    }
  });
}

createSkipIntroObserver();
createNextEpisodeObserver();
