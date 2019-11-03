export async function fetchPublicKey(client, query) {
  const { data } = await client.get(`/api/v0.1/publickeys/lookup?q=${query}`);
  return data || {};
}