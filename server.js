const express = require('express');
const fs = require('fs');
const nodemailer = require('nodemailer');

const app = express();
const port = 3000;

// Serve the emails.html file when accessing the /emails route
app.get('/emails', (req, res) => {
  fs.readFile('emails.txt', 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading the file:', err);
      res.status(500).send('Error reading the file');
      return;
    }

    res.send(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Email Content</title>
          <style>
            .notification {
              display: none;
              background-color: #f2f2f2;
              padding: 20px;
              margin-bottom: 15px;
            }
          </style>
        </head>
        <body>
          <h1>Email Content</h1>
          <pre>${data}</pre>
          <form action="/send-email" method="post" id="emailForm">
            <button type="submit">Send Email</button>
          </form>
          <div class="notification" id="notification"></div>
          <script>
            document.getElementById('emailForm').addEventListener('submit', async function (event) {
              event.preventDefault();
              const response = await fetch('/send-email', { method: 'POST' });
              const result = await response.text();
              const notification = document.getElementById('notification');
              notification.innerText = result;
              notification.style.display = 'block';
            });
          </script>
        </body>
      </html>
    `);
  });
});

// Handle POST request to send an email
app.post('/send-email', (req, res) => {
  fs.readFile('emails.txt', 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading the file:', err);
      res.status(500).send('Error reading the file');
      return;
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'abc@gmail.com',
        pass: 'abc',
      },
    });

    const mailOptions = {
      from: 'abc@gmail.com',
      to: 'recipient@example.com',
      subject: 'Write any subject',
      text: data,
    };

    transporter.sendMail(mailOptions, (error) => {
      if (error) {
        res.status(500).send('Error sending email!');
      } else {
        res.status(200).send('Email sent successfully!');
      }
    });
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/emails`);
});
