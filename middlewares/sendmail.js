const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // true cho cổng 465, false cho các cổng khác
  auth: {
    user: process.env.USER,
    pass: process.env.PASSWORD,
  },
});

const sendMail = async (to, subject, text, html) => {
  const info = await transporter.sendMail({
    from: '"FUNIO 👻" <tranlehai260662000@gmail.com>', // địa chỉ người gửi
    to, // danh sách người nhận
    subject, // tiêu đề
    text, // nội dung văn bản
    html, // nội dung HTML
  });
  console.log("Message sent: %s", info.messageId);
};

module.exports = { sendMail };
