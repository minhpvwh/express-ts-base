import mongooseService from "../../common/services/mongoose.service";
import { Document, Types } from 'mongoose';

const Schema = mongooseService.getMongoose().Schema;

export interface IDemo extends Document {
    email: string;
}

const schema = new Schema({
    _id: {type: Types.ObjectId, auto: true},
    name: {type: String}
});

const Demo = mongooseService.getMongoose().model<IDemo>('Demos', schema);
export default Demo;
