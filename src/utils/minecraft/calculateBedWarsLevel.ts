export default function calculateBedWarsLevel(experience: number): number {
  let level = Math.floor(experience / 487000) * 100;

  experience = experience % 487000;

  if (experience < 500)
    return level + experience / 500;
  level++;

  if (experience < 1500)
    return level + (experience - 500) / 1000;
  level++;

  if (experience < 3500)
    return level + (experience - 1500) / 2000;
  level++;

  if (experience < 7000)
    return level + (experience - 3500) / 3500;
  level++;

  experience -= 7000;

  return level + experience / 5000;
}