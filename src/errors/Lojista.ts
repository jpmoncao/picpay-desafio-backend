export class LojistaNotFoundError extends Error {
    name: string;
    message: string;
    code: string;

    constructor(message: string) {
        super(message);

        this.name = 'LojistaNotFoundError';
        this.code = 'LOJISTA_NOT_FOUND'
    }
}

export class LojistaMissingDataError extends Error {
    name: string;
    message: string;
    code: string;

    constructor(message: string) {
        super(message);

        this.name = 'LojistaMissingDataError';
        this.code = 'LOJISTA_HAS_MISSING_DATA'
    }
}
