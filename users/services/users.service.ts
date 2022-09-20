import UsersDao from '../daos/users.dao';
import { CreateUserDto } from '../dto/create.user.dto';
import { PutUserDto } from '../dto/put.user.dto';
import { PatchUserDto } from '../dto/patch.user.dto';
import User from '../models/user.model';
import BaseService from "../../base/services/base.service";
import {getAuth, createUserWithEmailAndPassword} from "firebase/auth";
import argon2 from "argon2";

class UsersService extends BaseService {
    model = User;

    // async create(resource: CreateUserDto) {
    //     resource.permissionLevel = 8;
    //     return UsersDao.addUser(resource);
    // }

    /**
     * Create user on firebase
     * */
    async createV2(req: any) {
        const {email, password} = req.body;
        const auth = getAuth();
        await createUserWithEmailAndPassword(auth, email, password)
            .then(async (userCredential) => {
                // Signed in
                const user = userCredential.user;
                req.body.providerUID = user.uid;
                req.body.password = await argon2.hash(req.body.password);
                return await this.model.create(req.body);
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                throw error
            });
    };

    // @ts-ignore
    async deleteById(id: string) {
        return UsersDao.removeUserById(id);
    }

    async patchById(id: string, resource: PatchUserDto): Promise<any> {
        return UsersDao.updateUserById(id, resource);
    }

    async putById(id: string, resource: PutUserDto): Promise<any> {
        return UsersDao.updateUserById(id, resource);
    }

    async readById(id: string) {
        return UsersDao.getUserById(id);
    }

    async updateById(id: string, resource: CreateUserDto): Promise<any> {
        return UsersDao.updateUserById(id, resource);
    }

    async getUserByEmail(email: string) {
        return UsersDao.getUserByEmail(email);
    }

    async getUserByEmailWithPassword(email: string) {
        return UsersDao.getUserByEmailWithPassword(email);
    }
}

export default new UsersService();
