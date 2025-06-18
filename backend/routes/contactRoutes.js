// backend/routes/contactRoutes.js
const express = require("express");
const nodemailer = require("nodemailer");

const router = express.Router();

router.post('/', async (req, res) => {
  const { name, email, message } = req.body;

  try {
    // Replace with your SMTP provider settings or a service like SendGrid
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    await transporter.sendMail({
      from: email,
      to: 'yashchudgar2004@gmail.com',
      subject: `New Contact Form Submission from ${name}`,
      text: message
    });

    res.status(200).json({ success: true, message: 'Message sent!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Error sending message' });
  }
});

module.exports = router;
