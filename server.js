const express = require('express');
const { spawn } = require('child_process');
const bodyParser = require('body-parser');
const cors = require('cors'); // Import the cors middleware
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Specify the list of allowed origins
const allowedOrigins = ['http://localhost:5501', 'http://127.0.0.1:5501'];

// Use cors middleware to enable CORS
app.use(cors({
  origin: function(origin, callback){
    // Allow requests with no origin (like mobile apps or curl requests)
    if(!origin) return callback(null, true);
    if(allowedOrigins.indexOf(origin) === -1){
      var msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  }
}));

// Use body-parser middleware to parse request bodies
app.use(bodyParser.json());

app.post('/call_python', (req, res) => {
    const json_body = req.body;
    const jsonString = JSON.stringify(json_body);
    console.log(jsonString);
    const pythonProcess = spawn('python3', ['./validate_user.py', jsonString]);

    let responseData = ''; // Initialize an empty string to collect the script's output

    pythonProcess.stdout.on('data', (data) => {
      responseData += data.toString(); // Collect the script's output
    });

    pythonProcess.on('close', (code) => {
      console.log(`Python script exited with code ${code}`);
      // Send the collected data as a JSON response
      console.log(responseData);
      res.json({ success: true, data: responseData });
    });
});

app.listen(3000, () => console.log('Server running on port 3000'));

