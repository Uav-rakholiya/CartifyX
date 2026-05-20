import nodemailer from 'nodemailer';

const sendEmail = async (options: { email: string; subject: string; message: string }) => {
    // Create a transporter
    // For production, use a real SMTP service like SendGrid, Mailgun, or Gmail
    // For now, we will use a test account or environment variables

    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'smtp.mailtrap.io',
        port: Number(process.env.SMTP_PORT) || 2525,
        auth: {
            user: process.env.SMTP_EMAIL,
            pass: process.env.SMTP_PASSWORD
        }
    });

    // Verify connection configuration
    try {
        if (!process.env.SMTP_EMAIL) {
            console.log('\n================ EMAIL SIMULATION ================');
            console.log(`To: ${options.email}`);
            console.log(`Subject: ${options.subject}`);
            console.log(`Message: \n${options.message}`);
            console.log('==================================================\n');
            return;
        }

        const message = {
            from: `${process.env.FROM_NAME || 'CartifyX'} <${process.env.FROM_EMAIL || 'noreply@cartifyx.com'}>`,
            to: options.email,
            subject: options.subject,
            text: options.message,
            // html: options.html // You can add HTML templates later
        };

        const info = await transporter.sendMail(message);
        console.log('Message sent: %s', info.messageId);
    } catch (error) {
        console.error('Error sending email:', error);
        // Fallback to console log if email fails in dev
        console.log('\n================ EMAIL SIMULATION (Fallback) ================');
        console.log(`To: ${options.email}`);
        console.log(`Subject: ${options.subject}`);
        console.log(`Message: \n${options.message}`);
        console.log('==================================================\n');
    }
};

export default sendEmail;
