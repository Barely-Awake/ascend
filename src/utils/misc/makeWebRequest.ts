import fetch, { Headers } from 'node-fetch';

export default async function makeWebRequest(url: string) {
  const requestHeaders = new Headers({
    Accept: 'application/json',
    'Content-Type': 'application/json',
    'User-Agent': 'ascend',
  });

  try {
    const request = await fetch(url, {
      headers: requestHeaders,
    });
    const data = await request.json();

    return data || null;
  } catch {
    return null;
  }
}
