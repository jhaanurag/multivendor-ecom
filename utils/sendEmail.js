const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
    // Create transporter (using Ethereal for testing, or env vars for production)
    // For a real app, you'd use SendGrid, Mailgun, or AWS SES
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'smtp.ethereal.email',
        port: process.env.SMTP_PORT || 587,
        auth: {
            user: process.env.SMTP_EMAIL || 'ethereal_user',
            pass: process.env.SMTP_PASSWORD || 'ethereal_pass',
        },
    });

    const message = {
        from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
        to: options.email,
        subject: options.subject,
        text: options.message,
        // html: options.html // Optional: Add HTML support
    };

    const info = await transporter.sendMail(message);

    console.log(`Message sent: ${info.messageId}`);
};

module.exports = sendEmail;
