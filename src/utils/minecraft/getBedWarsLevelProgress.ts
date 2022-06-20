export default function (bedWarsLevel: number) {
  bedWarsLevel = Number(bedWarsLevel.toFixed(2));

  const split = (bedWarsLevel / 100).toString().split('.');
  const remainder = Number(split[split.length - 1]);

  let neededXp = 5000;

  switch (remainder) {
    case 0:
      neededXp = 500;
      break;
    case 1:
      neededXp = 100;
      break;
    case 2:
      neededXp = 2000;
      break;
    case 3:
      neededXp = 3500;
  }
  const secondSplit = bedWarsLevel.toString().split('.');
  const progressPercentage = Number(secondSplit[secondSplit.length - 1]);
  return [getPercentage(neededXp, progressPercentage), neededXp];
}

function getPercentage(number: number, percentage: number) {
  return (number / 100) * percentage;
}