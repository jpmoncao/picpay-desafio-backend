export class ShopkeeperNotFoundError extends Error {
    name: string;
    message: string;
    code: string;

    constructor(message: string) {
        super(message);

        this.name = 'ShopkeeperNotFoundError';
        this.code = 'LOJISTA_NOT_FOUND'
    }
}

export class ShopkeeperMissingDataError extends Error {
    name: string;
    message: string;
    code: string;

    constructor(message: string) {
        super(message);

        this.name = 'ShopkeeperMissingDataError';
        this.code = 'LOJISTA_HAS_MISSING_DATA'
    }
}

export class ShopkeeperAlreadyExistsError extends Error {
    name: string;
    message: string;
    code: string;

    constructor(message: string) {
        super(message);

        this.name = 'ShopkeeperAlreadyExistsError';
        this.code = 'LOJISTA_ALREADY_EXISTS';
    }
}
