export class WalletNotFoundError extends Error {
    name: string;
    message: string;
    code: string;

    constructor(message: string) {
        super(message);

        this.name = 'WalletNotFoundError';
        this.code = 'WALLET_NOT_FOUND'
    }
}

export class WalletMissingDataError extends Error {
    name: string;
    message: string;
    code: string;

    constructor(message: string) {
        super(message);

        this.name = 'WalletMissingDataError';
        this.code = 'WALLET_HAS_MISSING_DATA'
    }
}
