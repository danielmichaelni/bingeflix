const MIN_SPEED = 0;

document.addEventListener("DOMContentLoaded", () => {
  const titleButton = document.querySelector(".title button");
  titleButton.addEventListener("click", () => {
    window.open("https://www.netflix.com/browse");
  });

  const skipIntroEnabledCheckbox = document.querySelector(
    "#skipIntroEnabledCheckbox"
  );
  const skipRecapEnabledCheckbox = document.querySelector(
    "#skipRecapEnabledCheckbox"
  );
  const nextEpisodeEnabledCheckbox = document.querySelector(
    "#nextEpisodeEnabledCheckbox"
  );
  const changeSpeedEnabledCheckbox = document.querySelector(
    "#changeSpeedEnabledCheckbox"
  );
  const speedControls = document.querySelector("#speedControls");

  const speedLabel = document.querySelector("#speedLabel");
  const decreaseSpeedButton = document.querySelector("#decreaseSpeedButton");
  const increaseSpeedButton = document.querySelector("#increaseSpeedButton");

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
      skipIntroEnabledCheckbox.checked = skipIntroEnabled;
      skipRecapEnabledCheckbox.checked = skipRecapEnabled;
      nextEpisodeEnabledCheckbox.checked = nextEpisodeEnabled;
      changeSpeedEnabledCheckbox.checked = changeSpeedEnabled;

      speedLabel.innerText = speed.toFixed(2);
      decreaseSpeedButton.disabled = speed <= MIN_SPEED;
    }
  );

  chrome.storage.sync.onChanged.addListener((changes) => {
    if (changes.speed) {
      const speed = changes.speed.newValue;
      speedLabel.innerText = speed.toFixed(2);
      decreaseSpeedButton.disabled = speed <= MIN_SPEED;
    }
  });

  skipIntroEnabledCheckbox.addEventListener("click", () => {
    chrome.storage.sync.set({
      skipIntroEnabled: skipIntroEnabledCheckbox.checked,
    });
  });
  skipRecapEnabledCheckbox.addEventListener("click", () => {
    chrome.storage.sync.set({
      skipRecapEnabled: skipRecapEnabledCheckbox.checked,
    });
  });
  nextEpisodeEnabledCheckbox.addEventListener("click", () => {
    chrome.storage.sync.set({
      nextEpisodeEnabled: nextEpisodeEnabledCheckbox.checked,
    });
  });
  changeSpeedEnabledCheckbox.addEventListener("click", () => {
    chrome.storage.sync.set({
      changeSpeedEnabled: changeSpeedEnabledCheckbox.checked,
    });
    if (changeSpeedEnabledCheckbox.checked) {
      speedControls.style.display = "block";
    } else {
      speedControls.style.display = "none";
    }
  });

  decreaseSpeedButton.addEventListener("click", () => {
    chrome.storage.sync.get(
      {
        speed: 1,
      },
      ({ speed }) => {
        const newSpeed = Math.max(MIN_SPEED, speed - 0.1);
        chrome.storage.sync.set({ speed: newSpeed });
      }
    );
  });
  increaseSpeedButton.addEventListener("click", () => {
    chrome.storage.sync.get(
      {
        speed: 1,
      },
      ({ speed }) => {
        const newSpeed = speed + 0.1;
        chrome.storage.sync.set({ speed: newSpeed });
      }
    );
  });
});
