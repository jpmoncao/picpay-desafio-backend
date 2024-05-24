export class CarteiraNotFoundError extends Error {
    name: string;
    message: string;
    code: string;

    constructor(message: string) {
        super(message);

        this.name = 'CarteiraNotFoundError';
        this.code = 'CARTEIRA_NOT_FOUND'
    }
}

export class CarteiraMissingDataError extends Error {
    name: string;
    message: string;
    code: string;

    constructor(message: string) {
        super(message);

        this.name = 'CarteiraMissingDataError';
        this.code = 'CARTEIRA_HAS_MISSING_DATA'
    }
}
