import nodemailer from "nodemailer";
import config from "../../config";

export const sendEmail = async (subject: string, to: string, html: string) => {
  const transporter = nodemailer.createTransport({
    // host: "smtp.gmail.com",
    // port: 465,
    // secure: config.node_env === "production",
    service: "gmail",
    auth: {
      user: config.email,
      pass: config.app_password,
    },
  });

  await transporter.sendMail({
    from: config.email,
    to,
    subject: subject,
    text: "",
    html,
  });
};
