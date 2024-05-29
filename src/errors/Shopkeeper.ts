export class ShopkeeperNotFoundError extends Error {
    name: string;
    message: string;
    code: string;

    constructor(message: string) {
        super(message);

        this.name = 'ShopkeeperNotFoundError';
        this.code = 'SHOPKEEPER_NOT_FOUND'
    }
}

export class ShopkeeperMissingDataError extends Error {
    name: string;
    message: string;
    code: string;

    constructor(message: string) {
        super(message);

        this.name = 'ShopkeeperMissingDataError';
        this.code = 'SHOPKEEPER_HAS_MISSING_DATA'
    }
}

export class ShopkeeperAlreadyExistsError extends Error {
    name: string;
    message: string;
    code: string;

    constructor(message: string) {
        super(message);

        this.name = 'ShopkeeperAlreadyExistsError';
        this.code = 'SHOPKEEPER_ALREADY_EXISTS';
    }
}
