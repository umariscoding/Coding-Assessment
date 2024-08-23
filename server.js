const express = require('express');
const xss = require('xss');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;


//loading the data
let messages = [];
let users = [];
try {
  messages = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'messages.json'), 'utf8'));
  users = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'users.json'), 'utf8'));
} catch (error) {
  console.error('Error reading data files:', error);
}

app.use(express.static(path.join(__dirname)));

//Configure XSS for sanitization
const xssFilter = new xss.FilterXSS({
  stripIgnoreTag: true,
  stripIgnoreTagBody: ['script']
});

app.get('/chat/3/messages', (req, res) => {
  try {
    const chatMessages = messages.filter(m => m.chatid === 3);
    if (chatMessages.length === 0) {
      res.status(404).send('<p>No messages found for chat ID 3.</p>');
    } else {
      res.send(chatMessages.map(m => `<p>${xssFilter.process(m.message)}</p>`).join(''));
    }
  } catch (error) {          //handling the errors
    console.error('Error processing chat messages:', error);
    res.status(500).send('<p>Internal Server Error</p>');
  }
});

app.get('/chat/8/messages', (req, res) => {
  try {
    const chatMessages = messages.filter(m => m.chatid === 8);
    if (chatMessages.length === 0) {
      res.status(404).json({ error: 'No messages found for chat ID 8.' });
    } else {
      res.json(chatMessages);
    }
  } catch (error) {
    console.error('Error processing chat messages:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/user/100', (req, res) => {
  try {
    const user = users.find(u => u.id === 100);
    if (!user) {
      res.status(404).json({ error: 'User ID 100 not found.' });
    } else {
      res.json(user);
    }
  } catch (error) {
    console.error('Error processing user data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/message/459', (req, res) => {
  try {
    const message = messages.find(m => m.id === 459);
    if (!message) {
      res.status(404).send('<p>Message ID 459 not found.</p>');
    } else {
      res.send(`<p>${xssFilter.process(message.message)}</p>`);
    }
  } catch (error) {
    console.error('Error processing message data:', error);
    res.status(500).send('<p>Internal Server Error</p>');
  }
});


app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
