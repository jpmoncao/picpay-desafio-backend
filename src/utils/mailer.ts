import nodemailer from "nodemailer";
import dotenv from "dotenv";
import { logger } from "./logger.js";

dotenv.config();

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // Use `true` for port 465, `false` for all other ports
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
    },
});

export default async function sendMail(emailTo: string, subject: string, html: string = '<b>Hello world?</b>', text?: string) {
    const info = await transporter.sendMail({
        from: '"Simulador de banco 🖖" <no-reply@simulabanco.email>',
        to: emailTo,
        subject,
        text,
        html: html,
    });

    logger.info("Email enviado: " + info.messageId + ' | <' + new Date() + '>');
}
