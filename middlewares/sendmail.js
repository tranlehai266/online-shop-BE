const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.USER,
    pass: process.env.PASSWORD,
  },
});

const sendMail = async (to, subject, text, html) => {
  const info = await transporter.sendMail({
    from: `"FUNIO 👻" <${process.env.USER}>`,
    to,
    subject,
    text,
    html,
  });
};

module.exports = { sendMail };
