// import nodemailer from "nodemailer";
// import config from "../../config";

// export const sendEmail = async (subject: string, to: string, html: string) => {
//   const transporter = nodemailer.createTransport({
//     service: "gmail",
//     auth: {
//       user: config.nodemailer.email,
//       pass: config.nodemailer.app_password,
//     },
//   });

//   await transporter.sendMail({
//     from: config.nodemailer.email,
//     to,
//     subject: subject,
//     text: "",
//     html,
//   });
// };

import { Resend } from "resend";
import config from "../../config";

const resend = new Resend(config.resend.api_key);

export const sendEmail = async (subject: string, to: string, html: string) => {
  try {
    await resend.emails.send({
      from: config.resend.sender_email as string,
      to,
      subject,
      html,
    });
  } catch (error) {
    console.error("❌ Failed to send email:", error);
    throw error;
  }
};
