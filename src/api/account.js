export async function fetchAccount(client) {
  const [publicKey, overlayAddress] =
    await Promise.all([
      client.pss.getPublicKey(),
      client.pss.baseAddr(),
    ]);

  return { publicKey, overlayAddress };
}