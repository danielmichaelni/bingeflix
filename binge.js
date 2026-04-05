const MIN_SPEED = 0;
const SPEED_STEP = 0.1;
const SPEED_PERSIST_DELAY_MS = 300;

const createButtonClickAttempt = (dataUia) => () => {
  const button = document.querySelector(`button[data-uia*="${dataUia}"]`);
  button?.click();
};

const skipIntroAttempt = createButtonClickAttempt("skip-intro");
const skipRecapAttempt = createButtonClickAttempt("player-skip-recap");
const nextEpisodeAttempt = createButtonClickAttempt("next-episode");
const normalizeSpeed = (speed) =>
  Math.max(MIN_SPEED, Math.round(speed * 100) / 100);

const main = () => {
  const target = document.querySelector("#appMountPoint");
  if (!target) {
    setTimeout(main, 200);
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
      let playbackRate = normalizeSpeed(speed);
      let persistSpeedTimeoutId;

      const applyPlaybackRate = () => {
        const video = document.querySelector("video");
        if (video) {
          video.playbackRate = isChangeSpeedEnabled ? playbackRate : 1;
        }
      };

      const persistPlaybackRate = () => {
        clearTimeout(persistSpeedTimeoutId);
        persistSpeedTimeoutId = window.setTimeout(() => {
          chrome.storage.sync.set({ speed: playbackRate });
        }, SPEED_PERSIST_DELAY_MS);
      };

      applyPlaybackRate();

      window.addEventListener("keydown", (event) => {
        if (!isChangeSpeedEnabled) {
          return;
        }

        if (
          event.getModifierState("Alt") ||
          event.getModifierState("Control") ||
          event.getModifierState("Meta") ||
          event.getModifierState("OS")
        ) {
          return;
        }

        if (
          event.target.nodeName === "INPUT" ||
          event.target.nodeName === "TEXTAREA" ||
          event.target.isContentEditable
        ) {
          return;
        }

        const video = document.querySelector("video");
        if (!video) {
          return;
        }

        const key = event.key.toLowerCase();
        if (key === "s") {
          playbackRate = normalizeSpeed(playbackRate - SPEED_STEP);
          video.playbackRate = playbackRate;
          persistPlaybackRate();
        }
        if (key === "d") {
          playbackRate = normalizeSpeed(playbackRate + SPEED_STEP);
          video.playbackRate = playbackRate;
          persistPlaybackRate();
        }
      });

      chrome.storage.onChanged.addListener(
        (
          {
            skipIntroEnabled,
            skipRecapEnabled,
            nextEpisodeEnabled,
            changeSpeedEnabled,
            speed,
          },
          areaName,
        ) => {
          if (areaName !== "sync") {
            return;
          }

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
              playbackRate = normalizeSpeed(speed.newValue);
            }
            applyPlaybackRate();
          }
        },
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
    },
  );
};

window.addEventListener("load", () => {
  main();
});
