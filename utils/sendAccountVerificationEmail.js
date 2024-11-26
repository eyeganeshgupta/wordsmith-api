const nodemailer = require("nodemailer");
require("dotenv").config();

/**
 * Sends an account verification email to the specified recipient.
 *
 * @param {string} recipientEmail - The email address of the recipient.
 * @param {string} verificationToken - The token used for account verification.
 * @throws Will throw an error if the email sending fails.
 */
const sendAccountVerificationEmail = async (
  recipientEmail,
  verificationToken
) => {
  let transporter;

  try {
    transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false, // Use true for port 465
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
      },
    });

    const emailOptions = {
      from: process.env.GMAIL_USER,
      to: recipientEmail,
      subject: "Account Verification Request",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 10px; background-color: #ffffff; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);">
          <div style="text-align: center; padding: 20px;">
            <img src="https://note.com/logo.png" alt="Company Logo" style="max-width: 150px; margin-bottom: 20px;">
            <h2 style="color: #007bff;">Account Verification Request</h2>
          </div>
          <p style="color: #555; font-size: 16px;">You are receiving this email because you (or someone else) have requested to verify your account.</p>
          <p style="color: #555; font-size: 16px;">To verify your account, please click the button below:</p>
          <a href="http://localhost:3000/verify-account/${verificationToken}" style="display: inline-block; padding: 15px 25px; margin: 20px 0; color: #fff; background-color: #007bff; text-decoration: none; border-radius: 5px; font-weight: bold; font-size: 16px;">Verify Account</a>
          <p style="color: #555; font-size: 16px;">If you did not request this, please ignore this email.</p>
          <hr style="border: 0; border-top: 1px solid #eaeaea; margin: 20px 0;">
          <p style="color: #777; font-size: 14px; text-align: center;">Thank you,<br> Wordsmith</p>
          <div style="text-align: center; margin-top: 20px;">
            <p style="font-size: 12px; color: #999;">&copy; ${new Date().getFullYear()} Wordsmith. All rights reserved.</p>
          </div>
        </div>
      `,
    };

    // Send the email
    const emailResponse = await transporter.sendMail(emailOptions);
    console.log("Email sent successfully:", emailResponse.messageId);
  } catch (error) {
    console.error("Error sending email:", error.message);
    throw new Error(
      "Failed to send account verification email. Please try again later."
    );
  }
};

module.exports = sendAccountVerificationEmail;
