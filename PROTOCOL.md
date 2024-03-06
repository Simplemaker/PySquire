# Protocol for PySquire Client and Server

## Squire Requests
The client (squire) can request commands to run from the server. These requests do not require a body.
```
POST /task
{
    "symkey": <symmetric key here>,
    "task_id": 0
}
```
Requests are encrypted via the public key stored in the client. The request contains a symmetric key 
for the server to respond with. Furthermore, the "task_id" field contains the index of the last
completed task. This allows the server to send a new task id.

## Server Tasks
Servers can respond to Squire Requests by assigning a task
```
{
    "command":"ls -al /",
    "task_id": 1
}
```
Tasks are given an ID for the server to identify task output with provided commands.

## Squire Reports
After a command finishes, a task report is filed to the server (encrypted via public key)
```
POST /report
{
    "stdout": <command stdout here>,
    "stderr": <commnad stderr here>,
    "task_id: 1
}
```
The server can then save, or display this task result.

