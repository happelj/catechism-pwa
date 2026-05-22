export function formatDuration(milliseconds: number) {
  const wholeSeconds = Math.max(0, Math.floor(milliseconds / 1000));
  const hours = Math.floor(wholeSeconds / 3600).toString().padStart(2, "0");
  const minutes = Math.floor((wholeSeconds % 3600) / 60).toString().padStart(2, "0");
  const seconds = (wholeSeconds % 60).toString().padStart(2, "0");

  return `${hours}h:${minutes}m:${seconds}s`;
}
