export default interface UserProps {
    id_user?: number | null;
    name?: string;
    cpf_cnpj?: string;
    email?: string;
    password?: string;
    person_type?: string;
    created_at?: string | null;
    token_2fa?: string | null;
    total?: number;
    [key: string]: any;
}
