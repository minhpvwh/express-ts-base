import mongooseService from "../../common/services/mongoose.service";
import {Document, Types} from "mongoose";

const Schema = mongooseService.getMongoose().Schema;

export interface IUser extends Document {
    providerUID: string;
    email: string;
    name: string,
    provider?: string,
    password?: string;
    firstName?: string;
    lastName?: string;
    role: string;
    permissionLevel?: number;
}

const userSchema = new Schema({
    _id: {type: Types.ObjectId, auto: true},
    email: {required: true, type: String, unique: true},
    password: { type: String, select: false, minlength: 8},
    name: {type: String, required: true},
    provider: {type: String, enum: ['provider', 'original'], default: 'original', lowercase: true},
    providerUID: {type: String},
    firstName: {type: String},
    wallet: {type: String},
    avatarUrl: {type: String},
    avatarPath: {type: String},
    role: {type: String, enum: ['ctv', 'leader', 'normal'], default: 'normal'},
    lastName: String,
    referCode: {type: String},
    referUser: {type: Object, ref: 'Users'},
    status: {type: String, enum: ['active', 'inactive'], default: 'active', lowercase: true},
    lastLogin: {type: Date},
    leader: {type: Object, ref: 'Users'}
}, {timestamps: true});

const User = mongooseService.getMongoose().model<IUser>('Users', userSchema);
export default User;
