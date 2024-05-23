export default interface UserProps {
    id_user?: number | null;
    nome?: string;
    cpf_cnpj?: string;
    email?: string;
    senha?: string;
    tipo_pessoa?: string;
    created_at?: string | null;
    [key: string]: any;
}
