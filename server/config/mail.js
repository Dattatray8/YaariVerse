import dotenv from "dotenv";
dotenv.config();

import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendMail = async (to, otp) => {
  try {
    await sgMail.send({
      to,
      from: process.env.EMAIL,
      subject: "YaariVerse Password Reset OTP",
      html: `
    <p>Hello,</p>
    <p>Your OTP to reset your YaariVerse password is: <b>${otp}</b>.</p>
    <p>This OTP expires in 5 minutes.</p>
    <p>Do not share it with anyone.</p>
    <p>Regards,<br>YaariVerse Team</p>
  `,
      replyTo: process.env.EMAIL,
      headers: {
        "X-Priority": "1",
        "X-MSMail-Priority": "High",
        Importance: "High",
      },
    });
    console.log("Email sent!");
  } catch (error) {
    console.error("SendGrid error:", error);
  }
};

export default sendMail;
