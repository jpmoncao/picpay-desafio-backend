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

export class UserDuplicateUsernameError extends Error {
    name: string;
    message: string;
    code: string;

    constructor(message: string) {
        super(message);

        this.name = 'UserDuplicateUsernameError';
        this.code = 'USERNAME_DUPLICATE'
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
