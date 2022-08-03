export default function parseDuration(duration: string) {
  if (Number.isNaN(duration.slice(0, -1)) && Number.isNaN(duration.slice(0, -2)))
    return null;

  let baseTime = 0;

  baseTime += 1000;
  if (duration.endsWith('s'))
    return parseInt(duration) * baseTime;

  baseTime *= 60;
  if (duration.endsWith('m'))
    return parseInt(duration) * baseTime;

  baseTime *= 60;
  if (duration.endsWith('h'))
    return parseInt(duration) * baseTime;

  baseTime *= 24;
  if (duration.endsWith('d'))
    return parseInt(duration) * baseTime;

  baseTime *= 7;
  if (duration.endsWith('w'))
    return parseInt(duration) * baseTime;

  baseTime *= 4;
  if (duration.endsWith('mo'))
    return parseInt(duration) * baseTime;

  baseTime *= 12;
  if (duration.endsWith('y'))
    return parseInt(duration) * baseTime;

  return null;
}
