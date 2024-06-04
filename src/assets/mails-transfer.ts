import { maskCpfCnpj } from "../utils/mask.js"

interface IUserMail {
    name: string,
    cpf_cnpj: string
}

export const mailTransferPayer = (payer: IUserMail, payee: IUserMail, amount: number, isPayer: boolean = true) => `
<!DOCTYPE html>
<html lang="pt-br">

<body
    style="padding: 0; margin: 0; box-sizing: border-box; font-family: 'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana, sans-serif;">
    <header style="background-color: rebeccapurple; padding: 1rem; color: white;">
        <h1>Transferência efetuada </h1>
    </header>
    <main>
        <p style="padding: 0.5rem 5rem;">
            <strong>Pagador: ${payer.name} </strong><br />
            <strong><em>CPF / CNPJ:${isPayer ? payer.cpf_cnpj : maskCpfCnpj(payer.cpf_cnpj)} </em></strong>
        </p>
        <hr />
        <p style="padding: 0.5rem 5rem;">
            <strong>Recebente: ${payee.name} </strong><br />
            <strong><em>CPF / CNPJ:${isPayer ? maskCpfCnpj(payee.cpf_cnpj) : payee.cpf_cnpj} </em></strong>
        </p>
        <hr />
        <p style="padding: 0.5rem 5rem;">
            <strong>Valor: </strong> R\$${(0.00).toLocaleString('pt-br', {
    minimumFractionDigits: 2
})}
        </p>
    </main>
</body>

</html>
`;
export const mailTransferPayee = `
<!DOCTYPE html>
<html lang="pt-br">

<body
    style="padding: 0; margin: 0; box-sizing: border-box; font-family: 'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana, sans-serif;">
    <header style="background-color: rebeccapurple; padding: 1rem; color: white;">
        <h1>Transferência efetuada </h1>
    </header>
    <main>
        <p style="padding: 0.5rem 5rem;">
            <strong>Pagador: ${'John Doe'} </strong><br />
            <strong><em>CPF / CNPJ:${'123.456.789-01'} </em></strong>
        </p>
        <hr />
        <p style="padding: 0.5rem 5rem;">
            <strong>Recebente: ${'John Doe'} </strong><br />
            <strong><em>CPF / CNPJ:${'123.456.789-01'} </em></strong>
        </p>
        <hr />
        <p style="padding: 0.5rem 5rem;">
            <strong>Valor: </strong> R\$${(0.00).toLocaleString('pt-br', {
    minimumFractionDigits: 2
})}
        </p>
    </main>
</body>

</html>
`;