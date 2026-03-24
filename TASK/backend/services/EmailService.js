const nodemailer = require('nodemailer');

// Create transporter - configure via .env
const createTransporter = () => {
    return nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: parseInt(process.env.SMTP_PORT) || 587,
        secure: false,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
    });
};

const sendWelcomeEmail = async ({ name, email, password, roleName }) => {
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
        console.warn('[EmailService] SMTP credentials not configured. Skipping welcome email.');
        return;
    }

    const transporter = createTransporter();

    const html = `
        <!DOCTYPE html>
        <html>
        <body style="font-family: Arial, sans-serif; background: #f1f5f9; padding: 30px;">
            <div style="max-width: 520px; margin: auto; background: white; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.08); overflow: hidden;">
                <div style="background: linear-gradient(135deg, #0284c7, #0ea5e9); padding: 30px; text-align: center;">
                    <h1 style="color: white; margin: 0; font-size: 24px;">Welcome to the Team!</h1>
                    <p style="color: #bae6fd; margin: 8px 0 0;">Your account has been created</p>
                </div>
                <div style="padding: 30px;">
                    <p style="color: #475569;">Hi <strong>${name}</strong>,</p>
                    <p style="color: #475569;">Your account has been set up. Here are your login credentials:</p>
                    
                    <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; margin: 20px 0;">
                        <table style="width: 100%; border-collapse: collapse;">
                            <tr>
                                <td style="padding: 8px 0; color: #64748b; font-size: 13px; width: 120px;">Portal URL</td>
                                <td style="padding: 8px 0; font-weight: bold; color: #0f172a;">${process.env.APP_URL || 'http://localhost:5173'}</td>
                            </tr>
                            <tr>
                                <td style="padding: 8px 0; color: #64748b; font-size: 13px;">Email</td>
                                <td style="padding: 8px 0; font-weight: bold; color: #0f172a;">${email}</td>
                            </tr>
                            <tr>
                                <td style="padding: 8px 0; color: #64748b; font-size: 13px;">Password</td>
                                <td style="padding: 8px 0; font-weight: bold; color: #0f172a;">${password}</td>
                            </tr>
                            <tr>
                                <td style="padding: 8px 0; color: #64748b; font-size: 13px;">Role</td>
                                <td style="padding: 8px 0; font-weight: bold; color: #0284c7;">${roleName || 'Staff'}</td>
                            </tr>
                        </table>
                    </div>

                    <p style="color: #ef4444; font-size: 13px;">⚠️ Please change your password after your first login for security.</p>
                    
                    <p style="color: #475569; margin-top: 24px;">Best regards,<br/><strong>Admin Team</strong></p>
                </div>
                <div style="background: #f8fafc; padding: 16px; text-align: center; border-top: 1px solid #e2e8f0;">
                    <p style="color: #94a3b8; font-size: 12px; margin: 0;">This is an automated message. Please do not reply.</p>
                </div>
            </div>
        </body>
        </html>
    `;

    try {
        await transporter.sendMail({
            from: `"${process.env.APP_NAME || 'Project Management'}" <${process.env.SMTP_USER}>`,
            to: email,
            subject: `Welcome to ${process.env.APP_NAME || 'Project Management'} — Your Account Details`,
            html,
        });
        console.log(`[EmailService] Welcome email sent to ${email}`);
    } catch (error) {
        if (error.responseCode === 535) {
            console.error('[EmailService] SMTP Authentication failed (Error 535). Please check your SMTP_USER and SMTP_PASS in .env.');
        } else {
            console.error('[EmailService] Error sending email:', error.message);
        }
        // Don't rethrow, avoid crashing the main process
    }
};

module.exports = { sendWelcomeEmail };
