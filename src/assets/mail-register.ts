import dotenv from 'dotenv';
import { decrypt } from '../utils/hash.js';

interface IUserMail {
    name: string
    id_user: number
    hash: string
}

dotenv.config();

export const mailRegisterUser = ({ name, id_user, hash }: IUserMail) => `
<!DOCTYPE html>
<html lang="pt-br">

<body
    style="padding: 2rem 4rem; margin: 0; box-sizing: border-box; font-family: 'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana, sans-serif; min-height: 30vh;">
    <header style="background-color: rebeccapurple; padding: 1rem; color: white;">
        <h1>Olá ${name}!</h1>
    </header>
    <main style="display: flex; justify-content: center; align-items: center; flex-direction: column;">
        <p style="padding: 0.5rem 0;">Para concluir seu registro em nossa plataforma é necessário autenticar seu cadastro clicando no <strong>botão abaixo!</strong></p>
        <a href="${process.env.REGISTER_HREF ?? '' + id_user + '?code="' + decrypt(hash) + '"'}" style="background-color: rebeccapurple; padding: 1rem 3rem; color: white;">Confirmar cadastro</a>
    </main>
    <hr />
</body>

</html>
`;