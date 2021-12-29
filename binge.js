function createObserver() {
  const target = document.querySelector("#appMountPoint");
  if (!target) {
    setTimeout(createObserver, 200);
    return;
  }

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
        const buttons = document.querySelectorAll("button");
        buttons.forEach((button) => {
          if (button.innerText === "Skip Intro") {
            button.click();
          }
        });
      };

      const nextEpisodeAttempt = () => {
        const buttons = document.querySelectorAll("button");
        buttons.forEach((button) => {
          if (button.innerText === "Next Episode") {
            button.click();
          }
        });
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

createObserver();
