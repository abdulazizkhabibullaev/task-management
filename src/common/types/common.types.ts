import { Request } from 'express';
import { Document } from 'mongoose';
import { AcceptLanguages } from '../constant/languages';
import { User } from '../db/models/user/user.model';

export interface CustomRequest extends Request {
    user: User & Document;
    lang: AcceptLanguages;
}
