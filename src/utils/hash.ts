import crypto from 'crypto';
import dotenv from 'dotenv'

dotenv.config();

//Checking the crypto module
const algorithm = 'aes-256-cbc';
const key = process.env.PWD_INIT_HASH ?? '';
const iv = process.env.PWD_INIT_VECTOR ?? '';

/**
 * 
 * @param text Texto para ser criptografado
 * @returns Texto criptografado
 */
export function encrypt(text: string): string {
    if (!key || !iv) {
        throw new Error('A chave e o vetor de inicialização são necessários');
    }
    const keyBuffer = Buffer.from(key, 'hex');
    const ivBuffer = Buffer.from(iv, 'hex');

    let cipher = crypto.createCipheriv(algorithm, keyBuffer, ivBuffer);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return encrypted.toString('hex');
}

/**
 * 
 * @param text Texto para ser descriptografado
 * @returns Texto descriptografado
 */
export function decrypt(text: string): string {
    if (!key || !iv) {
        throw new Error('A chave e o vetor de inicialização são necessários');
    }
    const keyBuffer = Buffer.from(key, 'hex');
    const ivBuffer = Buffer.from(iv, 'hex');

    let encryptedText = Buffer.from(text, 'hex');
    let decipher = crypto.createDecipheriv(algorithm, keyBuffer, ivBuffer);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
}
