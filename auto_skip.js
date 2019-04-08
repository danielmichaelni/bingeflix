function skipIntroIfPossible() {
  const skipIntroButton = document.querySelector(".skip-credits > a");
  if (skipIntroButton) {
    skipIntroButton.click();
  }
}

function createObserverWithRetry() {
  const controls = document.querySelector(".PlayerControlsNeo__layout");
  if (!controls) {
    setTimeout(createObserverWithRetry, 100);
    return;
  }
  const observer = new MutationObserver(skipIntroIfPossible);
  observer.observe(controls, { childList: true });
}

createObserverWithRetry();
