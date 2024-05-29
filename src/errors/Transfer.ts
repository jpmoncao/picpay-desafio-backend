export class TransferNotFoundError extends Error {
    name: string;
    message: string;
    code: string;

    constructor(message: string) {
        super(message);

        this.name = 'TransferNotFoundError';
        this.code = 'TRANSFER_NOT_FOUND'
    }
}

export class TransferMissingDataError extends Error {
    name: string;
    message: string;
    code: string;

    constructor(message: string) {
        super(message);

        this.name = 'TransferMissingDataError';
        this.code = 'TRANSFER_HAS_MISSING_DATA'
    }
}

export class TransferShopkeeperPayerError extends Error {
    name: string;
    message: string;
    code: string;

    constructor(message: string) {
        super(message);

        this.name = 'TransferPayerIsShopkeeperError';
        this.code = 'TRANSFER_PAYER_IS_SHOPKEEPER';
    }
}

export class TransferPayerIsEqualPayeeError extends Error {
    name: string;
    message: string;
    code: string;

    constructor(message: string) {
        super(message);

        this.name = 'TransferPayerIsEqualPayeeError';
        this.code = 'TRANSFER_PAYER_IS_EQUAL_PAYEE';
    }
}

export class TransferAmountIsInvalidError extends Error {
    name: string;
    message: string;
    code: string;

    constructor(message: string) {
        super(message);

        this.name = 'TransferAmountIsInvalidError';
        this.code = 'TRANSFER_AMOUNT_IS_INVALID';
    }
}