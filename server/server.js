const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;
//map to store key value pair
const htmlOutput = new Map();
htmlOutput.set('table', 
  `<table>
    <tr>
      <th>Header 1</th>
      <th>Header 2</th>
    </tr>
    <tr>
      <td>Row 1, Cell 1</td>
      <td>Row 1, Cell 2</td>
    </tr>
    <tr>
      <td>Row 2, Cell 1</td>
      <td>Row 2, Cell 2</td>
    </tr>
  </table>`);
  htmlOutput.set('list',
    `<ul>
      <li>Item 1</li>
      <li>Item 2</li>
      <li>Item 3</li>
    </ul>`);
  htmlOutput.set('paragraph',
    `<p>a brown fox jumps over the lazy dog. lorem ipsum dolor sit amet, consectetur adipiscing elit. Paragraph content</p>`);

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// API endpoint to handle chat messages
app.post('/api/chat', (req, res) => {
  const { message } = req.body;
  
  // Get current timestamp
  const timestamp = new Date().toLocaleString();
  
  // Echo back the user's message with timestamp
  var customOutput = htmlOutput.get(message);
  const htmlResponse = `
    <div>
      <p>You said: <strong>${message}</strong></p>
      ${customOutput || ''} 
      <p class="timestamp">Response time: ${timestamp}</p>
    </div>
  `;
  
  res.json({ response: htmlResponse });
});

// Serve the React app for any other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
