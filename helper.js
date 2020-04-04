document.addEventListener("nextEpisode", () => {
  const nextEpisodeButton = document.querySelector(
    '[data-uia="next-episode-seamless-button"]'
  );
  if (nextEpisodeButton) {
    Object.keys(nextEpisodeButton).forEach((key) => {
      if (key.startsWith("__reactInternalInstance$")) {
        nextEpisodeButton[key].memoizedProps.onPointerDown(
          new PointerEvent("click")
        );
      }
    });
  }
});
