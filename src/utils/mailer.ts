import nodemailer from "nodemailer";
import dotenv from "dotenv";

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


export default async function sendMail(emailTo: string, html: string = '<b>Hello world?</b>') {
    const info = await transporter.sendMail({
        from: '"Simulador de banco 🖖" <no-reply@simulabanco.email>',
        to: emailTo,
        subject: "Uma transferência foi efetuada com sucesso!",
        text: "{{ISSO É UMA TRANSAÇÃO FICTÍCIA}}",
        html: html,
    });

    console.log("Email enviado: " + info.messageId + ' | <' + new Date() + '>');
}
