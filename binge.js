function createObserver() {
  const target = document.querySelector("#appMountPoint");
  if (!target) {
    setTimeout(createObserver, 200);
    return;
  }

  chrome.storage.sync.get(
    {
      skipIntroEnabled: true,
      nextEpisodeEnabled: true,
      changeSpeedEnabled: true,
      speed: 1,
    },
    ({ skipIntroEnabled, nextEpisodeEnabled, changeSpeedEnabled, speed }) => {
      let isSkipIntroEnabled = skipIntroEnabled;
      let isNextEpisodeEnabled = nextEpisodeEnabled;
      let isChangeSpeedEnabled = changeSpeedEnabled;
      let playbackRate = speed;

      if (isChangeSpeedEnabled) {
        const video = document.querySelector("video");
        if (video) {
          video.playbackRate = playbackRate;
        }
      }

      chrome.storage.onChanged.addListener(
        ({
          skipIntroEnabled,
          nextEpisodeEnabled,
          changeSpeedEnabled,
          speed,
        }) => {
          if (skipIntroEnabled) {
            isSkipIntroEnabled = skipIntroEnabled.newValue;
          }
          if (nextEpisodeEnabled) {
            isNextEpisodeEnabled = nextEpisodeEnabled.newValue;
          }
          if (changeSpeedEnabled || speed) {
            if (changeSpeedEnabled) {
              isChangeSpeedEnabled = changeSpeedEnabled.newValue;
            }
            if (speed) {
              playbackRate = speed.newValue;
            }
            const video = document.querySelector("video");
            if (!video) {
              return;
            }
            if (isChangeSpeedEnabled) {
              video.playbackRate = playbackRate;
            } else {
              video.playbackRate = 1;
            }
          }
        }
      );

      const skipIntroAttempt = () => {
        const skipIntroButton = document.querySelector(
          'button[data-uia*="skip-intro"]'
        );
        if (skipIntroButton) {
          skipIntroButton.click();
        }
        // const buttons = document.querySelectorAll("button");
        // buttons.forEach((button) => {
        //   if (button.innerText === "Skip Intro") {
        //     button.click();
        //   }
        // });
      };

      const nextEpisodeAttempt = () => {
        const nextEpisodeButton = document.querySelector(
          'button[data-uia*="next-episode"]'
        );
        if (nextEpisodeButton) {
          nextEpisodeButton.click();
        }
        // const buttons = document.querySelectorAll("button");
        // buttons.forEach((button) => {
        //   if (button.innerText === "Next Episode") {
        //     button.click();
        //   }
        // });
      };

      const observer = new MutationObserver(() => {
        if (isSkipIntroEnabled) {
          skipIntroAttempt();
        }
        if (isNextEpisodeEnabled) {
          nextEpisodeAttempt();
        }
        const video = document.querySelector("video");
        if (
          isChangeSpeedEnabled &&
          video &&
          video.playbackRate !== playbackRate
        ) {
          video.playbackRate = playbackRate;
        }
      });
      observer.observe(target, { childList: true, subtree: true });
    }
  );
}

createObserver();
