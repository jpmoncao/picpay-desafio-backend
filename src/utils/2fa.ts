import { decrypt, encrypt } from "./hash.js";
import { logger } from "./logger.js";

/**
 * Cria um sequencial númerico que será usado para identificar o login
 * @returns Retorna um sequencial númerico
 */
function generate2FACode(): number {
    return Math.floor(Math.random() * 9000000) + 1000;
}

/**
 * Cria um hash com um sequencial númerico criado
* @returns Retorna o hash
 */
export function generate2FAHash(): string {
    const code: number = generate2FACode();
    const codeLPAD = code.toString().padStart(6, '0');

    logger.log('verbose', 'Code 2FA gerado: ' + codeLPAD);
    return encrypt(codeLPAD);
}

/**
 * Descriptografa o hash e retorna o código para efeito de comparação
 * @param authHash Hash de autentificação gerado
 * @returns Retorna o código descriptografado
 */
export function decode2FAHash(authHash: string): string {
    return decrypt(authHash);
}