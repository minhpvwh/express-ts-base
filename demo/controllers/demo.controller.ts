import DemoService from '../services/demo.service';
import debug from 'debug';
import BaseController from "../../base/controllers/base.controller";

const log: debug.IDebugger = debug('app:demo-controller');

class DemoController extends BaseController {
    service = DemoService;
}

export default new DemoController();
