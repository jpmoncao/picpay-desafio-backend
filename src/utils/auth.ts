import jwt from "jsonwebtoken";
import dotenv from 'dotenv';

dotenv.config();

/**
 * 
 * @param payload Conteúdo oculto no token
 * @param secret Adiciona a chave secreta, se não passar nada usa a chave do .env 
 * @returns Retorna o token (jwt) gerado
 */
export function signToken(payload: {}, secret?: string): string {
    const secretKey = secret ?? process.env.JWT_SECRET;
    const token = jwt.sign(payload, secretKey ?? '');

    return token;
}

/**
 * 
 * @param token Adiciona o token de verificação
 * @param secret Adiciona a chave secreta, se não passar nada usa a chave do .env
 * @returns Retorna o payload do token
 */
export function verifyToken(token: string, secret?: string): any {
    const secretKey = secret ?? process.env.JWT_SECRET;
    return jwt.verify(token, secretKey ?? '');
}