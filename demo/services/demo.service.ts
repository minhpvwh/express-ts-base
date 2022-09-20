import Demo from '../models/demo.model';
import BaseService from "../../base/services/base.service";

class DemoService extends BaseService {
    model = Demo;
}

export default new DemoService();
