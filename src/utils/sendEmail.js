import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config()

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false,
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD
    }
})


export default async function sendEmail({ to, subject, html }) {
    console.log('its herererererer',to,'..........', subject,'............', html)
    console.log(process.env.EMAIL,'this is the smtp email')
    await transporter.sendMail({
        from: process.env.EMAIL,
        to,
        subject,
        html,
    });
}
