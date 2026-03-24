const SECRET = process.env.REACT_APP_PAYLOAD_SECRET as string;

if (!SECRET) {
  throw new Error("Missing REACT_APP_PAYLOAD_SECRET");
}

export const encryptPayload = async (
  payload: unknown
): Promise<string> => {
  const encoder = new TextEncoder();

  const keyBytes = Uint8Array.from(
    SECRET.match(/.{1,2}/g)!.map(b => parseInt(b, 16))
  );

  const key = await window.crypto.subtle.importKey(
    "raw",
    keyBytes,
    { name: "AES-GCM" },
    false,
    ["encrypt"]
  );

  const iv = window.crypto.getRandomValues(new Uint8Array(12));

  const encrypted = await window.crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    encoder.encode(JSON.stringify(payload))
  );

  const encryptedArray = new Uint8Array(encrypted);

  const combined = new Uint8Array(iv.length + encryptedArray.length);
  combined.set(iv);
  combined.set(encryptedArray, iv.length);


  return btoa(String.fromCharCode(...combined));
};
