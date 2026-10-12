;(() => {
  // `settingsCore` is injected ahead of this script (see settings-core.js).
  const stored = settingsCore.readStored()
  if (stored) settingsCore.applyToRoot(settingsCore.normalize(stored))
})()
