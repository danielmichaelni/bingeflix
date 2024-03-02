const createButtonClickAttempt = (dataUia) => () => {
  const button = document.querySelector(`button[data-uia*="${dataUia}"]`);
  button?.click();
};

const skipIntroAttempt = createButtonClickAttempt("skip-intro");
const skipRecapAttempt = createButtonClickAttempt("player-skip-recap");
const nextEpisodeAttempt = createButtonClickAttempt("next-episode");

const createObserver = () => {
  const target = document.querySelector("#appMountPoint");
  if (!target) {
    setTimeout(createObserver, 200);
    return;
  }

  chrome.storage.sync.get(
    {
      skipIntroEnabled: true,
      skipRecapEnabled: true,
      nextEpisodeEnabled: true,
      changeSpeedEnabled: true,
      speed: 1,
    },
    ({
      skipIntroEnabled,
      skipRecapEnabled,
      nextEpisodeEnabled,
      changeSpeedEnabled,
      speed,
    }) => {
      let isSkipIntroEnabled = skipIntroEnabled;
      let isSkipRecapEnabled = skipRecapEnabled;
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
          skipRecapEnabled,
          nextEpisodeEnabled,
          changeSpeedEnabled,
          speed,
        }) => {
          if (skipIntroEnabled) {
            isSkipIntroEnabled = skipIntroEnabled.newValue;
          }
          if (skipRecapEnabled) {
            isSkipRecapEnabled = skipRecapEnabled.newValue;
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

      const observer = new MutationObserver(() => {
        if (isSkipIntroEnabled) {
          skipIntroAttempt();
        }
        if (isSkipRecapEnabled) {
          skipRecapAttempt();
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
};

createObserver();
