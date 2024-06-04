import { Request } from 'express';
import UserProps from '../database/domain/user.js';

export interface TRequest extends Request {
    user?: UserProps;
}
