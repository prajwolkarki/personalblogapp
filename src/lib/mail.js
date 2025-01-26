import nodemailer from "nodemailer";

export async function sendEmail({ to, subject, text }) {
  try {
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject,
      text,
    };

    // Send the email
    const info = await transporter.sendMail(mailOptions);

    console.log(`Email sent: ${info.messageId}`);
    return true;
  } catch (error) {
    console.error("Failed to send email:", error);
    throw new Error("Email sending failed");
  }
}
