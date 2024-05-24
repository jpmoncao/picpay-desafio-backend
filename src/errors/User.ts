export class UserNotFoundError extends Error {
    name: string;
    message: string;
    code: string;

    constructor(message: string) {
        super(message);

        this.name = 'UserNotFoundError';
        this.code = 'USER_NOT_FOUND'
    }
}

export class UserDuplicateCNPJError extends Error {
    name: string;
    message: string;
    code: string;

    constructor(message: string) {
        super(message);

        this.name = 'UserDuplicateCNPJError';
        this.code = 'USER_CNPJ_DUPLICATE'
    }
}

export class UserDuplicateCPFError extends Error {
    name: string;
    message: string;
    code: string;

    constructor(message: string) {
        super(message);

        this.name = 'UserDuplicateCPFError';
        this.code = 'USER_CPF_DUPLICATE'
    }
}
export class UserDuplicateEmailError extends Error {
    name: string;
    message: string;
    code: string;

    constructor(message: string) {
        super(message);

        this.name = 'UserDuplicateEmailError';
        this.code = 'USER_EMAIL_DUPLICATE'
    }
}

export class UserMissingDataError extends Error {
    name: string;
    message: string;
    code: string;

    constructor(message: string) {
        super(message);

        this.name = 'UserMissingDataError';
        this.code = 'USER_HAS_MISSING_DATA'
    }
}

export class UserIncorrectPatternError extends Error {
    name: string;
    message: string;
    code: string;

    constructor(message: string) {
        super(message);

        this.name = 'UserIncorrectPatternError';
        this.code = 'USER_HAS_INCORRECT_DATA'
    }
}
