import Gmail from "../models/GmailModel.js";
import mongoose from "mongoose";
import nodemailer from "nodemailer";

export const createGmail = async (req, res) => {
  const { name, email, phone, message } = req.body;

//   console.log(process.env.SMTP_PASS)

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  // Set up email data
  const mailOptions = {
    from: `${name} <${email}>`,
    to: process.env.SMTP_USER, 
    subject: "Lalezar's Clients",
    text: `Name: ${name}\nEmail: ${email}\nPhone: ${phone}\nMessage: ${message}`, // Plain text body
    html: `<p><strong>Name:</strong> ${name}</p>
           <p><strong>Email:</strong> ${email}</p>
           <p><strong>Phone:</strong> ${phone}</p>
           <p><strong>Message:</strong><br/> ${message}</p>`, // HTML body
  };

  // Send email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      res.status(500).send("Error sending email");
    } else {
    //   console.log("Email sent: " + info.response);
      res.status(200).send("Email sent successfully");
    }
  });

  //   console.log(req.body);
};
