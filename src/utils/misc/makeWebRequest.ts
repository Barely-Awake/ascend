import fetch from 'node-fetch';

export default async function makeWebRequest(url: string) {
  try {
    const request = await fetch(url);
    const data = await request.json();

    return data || null;
  } catch {
    return null;
  }
}
