import fetch from 'node-fetch';

export default async function (playerName: string) {
  try {
    let data: any = await fetch(`https://api.mojang.com/users/profiles/minecraft/${playerName}`);
    data = await data.json();

    return data.id;
  } catch (error) {
    return false;
  }
}