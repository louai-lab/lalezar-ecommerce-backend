import bcrypt from "bcrypt";
import dotenv from "dotenv";
import { generateToken } from "../utils/Jwt.js";
import User from "../models/UserModel.js";
import nodemailer from "nodemailer";

dotenv.config();

export const google = async (req, res, next) => {
  const { name, email, image } = req.body;

  // console.log("1", image);
  // console.log("2", req.body.photo);
  try {
    const user = await User.findOne({ email });

    if (user) {
      const token = generateToken(user);
      const { password, ...rest } = user.toObject();
      // console.log(rest);
      return res
        .cookie("token", token, { httpOnly: true })
        .status(200)
        .json(rest);
    } else {
      const generatedPassword =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8);
      const hashedPassword = await bcrypt.hash(generatedPassword, 10);

      // Assuming the Google data includes both first and last names
      const fullName = name.split(" ");
      const generatedFirstName = fullName[0] || "DefaultFirstName";
      const generatedLastName =
        fullName.length > 1 ? fullName.slice(1).join(" ") : "DefaultLastName";

      const newUser = await User.create({
        firstName: generatedFirstName,
        lastName: generatedLastName,
        email: email,
        password: hashedPassword,
        image: image,
        role: "Customer",
      });

      // const token = generateToken({ user: newUser });
      const token = generateToken(newUser);
      const { password, ...rest } = newUser.toObject();

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
        from: `Your Website Name <${process.env.SMTP_USER}>`,
        to: email,
        subject: "Welcome to Lalezar!",
        html: `
        <p>Dear ${generatedFirstName},</p>
        <p>Thank you for signing up to <strong>Lalezar</strong>! We're excited to have you on board.</p>
        <p>Here are your details:</p>
        <p><strong>Email:</strong> ${email}</p>
        <p>If you have any questions or need assistance, feel free to reach out to our support team.</p>
        <p>Best regards,</p>
        <p><strong>Lalezar Team</strong></p>
      `,
      };

      // Send email
      try {
        await transporter.sendMail(mailOptions);
        console.log("Email sent successfully");
      } catch (emailError) {
        console.log(emailError);
        return res.status(500).send("Error sending email");
      }

      // console.log(rest);
      return res
        .cookie("token", token, {
          httpOnly: true,
          secure: true,
          sameSite: "None",
        })
        .status(200)
        .json(rest);
    }
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
