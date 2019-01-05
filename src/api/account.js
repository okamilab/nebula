export async function fetchAccount(client) {
  try {
    const [publicKey, overlayAddress] =
      await Promise.all([
        client.pss.getPublicKey(),
        client.pss.baseAddr(),
      ]);

    return { publicKey, overlayAddress };
  } catch (error) {
    console.log(error)
  }
}