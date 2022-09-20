import shortid from 'shortid';
import debug from 'debug';
import {CreateUserDto, CreateUserWithoutPassWordDto} from '../dto/create.user.dto';
import { PatchUserDto } from '../dto/patch.user.dto';
import { PutUserDto } from '../dto/put.user.dto';
import User from '../models/user.model';

const log: debug.IDebugger = debug('app:users-dao');

class UsersDao {
    // Schema = mongooseService.getMongoose().Schema;
    //
    // userSchema = new this.Schema({
    //     _id: String,
    //     email: {required: true, type: String, unique: true},
    //     password: { type: String, select: false },
    //     firstName: String,
    //     lastName: String,
    //     permissionLevel: Number,
    // });
    //
    // User = mongooseService.getMongoose().model('Users', this.userSchema);

    constructor() {
        log('Created new instance of UsersDao');
    }

    async addUser(userFields: CreateUserDto) {
        // const userId = shortid.generate();
        const user = new User({
            permissionLevel: 1,
            ...userFields,
        });
        await user.save();
        return user._id;
    }

    async addUserWithoutPassword(userFields: CreateUserWithoutPassWordDto) {
        const user = new User({
            ...userFields
        })
        await user.save();
        return user;
    }

    async getUserByEmail(email: string) {
        return User.findOne({ email: email }).exec();
    }

    async getUserByProviderUID(providerUID: string) {
        return User.findOne({ providerUID }).exec();
    }

    async getUserByEmailWithPassword(email: string) {
        return User.findOne({ email: email })
            .select('_id email role provider +password')
            .exec();
    }

    async getUserByIdAndEmail(id: string, email: string) {
        return User.findOne({_id: id, email}).lean();
    }

    async removeUserById(userId: string) {
        return User.deleteOne({ _id: userId }).exec();
    }

    async getUserById(userId: string) {
        return User.findOne({ _id: userId }).populate('User').exec();
    }

    async getUsers(limit = 25, page = 0) {
        return User.find()
            .limit(limit)
            .skip(limit * page)
            .exec();
    }

    async updateUserById(
        userId: string,
        userFields: PatchUserDto | PutUserDto
    ) {
        const existingUser = await User.findOneAndUpdate(
            { _id: userId },
            { $set: userFields },
            { new: true }
        ).exec();

        return existingUser;
    }
}

export default new UsersDao();
