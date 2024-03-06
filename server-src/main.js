import  express  from 'express';
import bodyParser from 'body-parser';

const app = express();
const port = 3000;

// Middleware to parse JSON data
app.use(bodyParser.json());

// Endpoint to handle JSON data at /poll
app.post('/poll', (req, res) => {
  const jsonData = req.body;

  if (jsonData) {
    console.log('Received JSON data:', jsonData);
    res.status(200).json({ message: 'JSON data received successfully' });
  } else {
    res.status(400).json({ error: 'Invalid JSON data' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
