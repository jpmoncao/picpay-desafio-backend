/**
 * 
 * @param cpf_cnpj Nº de documento que será recebido
 * @param charMask Caractére que máscara a string (padrão: *)
 * @returns Retorna uma máscara que mostrar primeiros 3 caracteres e os 2 últimos
 */
export function maskCpfCnpj(cpf_cnpj: string, charMask: string = '*'): string {
    const charCount = cpf_cnpj.length;

    return cpf_cnpj.substr(0, 3) + (charMask.repeat(charCount - 5)) + cpf_cnpj.substr(charCount - 2, charCount)
}