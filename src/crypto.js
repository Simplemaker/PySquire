const algo = CRYPTO_ALGO;
const pubkey = PUBLIC_KEY;
import crypto from "crypto";

// Decrypt base64-encoded encrypted object to JSON object
function symmetricDecrypt({ iv, data }, symkey) {
  if (typeof symkey == "string") {
    symkey = Buffer.from(symkey, "base64");
  }
  if (typeof iv == "string") {
    iv = Buffer.from(iv, "base64");
  }
  const cipher = crypto.createDecipheriv(algo, symkey, iv);
  const decryptedResponse =
    cipher.update(data, "base64", "utf8") + cipher.final("utf8");
  return JSON.parse(decryptedResponse);
}

function symmetricEncrypt(json, symkey) {
  const iv = crypto.randomBytes(16);
  if (typeof symkey == "string") {
    symkey = Buffer.from(symkey, "base64");
  }
  const cipher = crypto.createDecipheriv(algo, symkey, iv);
  return {
    data:
      cipher.update(JSON.stringify(json), "utf8", "base64") +
      cipher.final("base64"),
    iv: iv.toString("base64"),
  };
}

// Encrypt JSON object using pubkey, and return as base64-encoded buffer
function pubkeyEncrypt(json) {
  return {
    data: crypto
      .publicEncrypt(
        {
          key: pubkey,
          padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
          oaepHash: "sha256",
        },
        Buffer.from(JSON.stringify(json))
      )
      .toString("base64"),
  };
}

function privkeyDecrypt({ data }, private_key) {
  return JSON.parse(
    crypto.privateDecrypt(
      {
        key: private_key,
        padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
        oaepHash: "sha256",
      },
      Buffer.from(data, "base64")
    )
  );
}

export { symmetricDecrypt, symmetricEncrypt, pubkeyEncrypt, privkeyDecrypt };
