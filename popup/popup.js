document.addEventListener("DOMContentLoaded", () => {
  const skipIntroEnabledCheckbox = document.querySelector(
    "#skipIntroEnabledCheckbox"
  );
  const nextEpisodeEnabledCheckbox = document.querySelector(
    "#nextEpisodeEnabledCheckbox"
  );

  chrome.storage.sync.get(
    ["skipIntroEnabled", "nextEpisodeEnabled"],
    ({ skipIntroEnabled, nextEpisodeEnabled }) => {
      skipIntroEnabledCheckbox.checked = skipIntroEnabled;
      nextEpisodeEnabledCheckbox.checked = nextEpisodeEnabled;
    }
  );

  skipIntroEnabledCheckbox.addEventListener("click", () => {
    chrome.storage.sync.set({
      skipIntroEnabled: skipIntroEnabledCheckbox.checked
    });
  });
  nextEpisodeEnabledCheckbox.addEventListener("click", () => {
    chrome.storage.sync.set({
      nextEpisodeEnabled: nextEpisodeEnabledCheckbox.checked
    });
  });
});
