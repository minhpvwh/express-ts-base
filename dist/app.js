"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const dotenvResult = dotenv_1.default.config();
if (dotenvResult.error) {
    throw dotenvResult.error;
}
const express_1 = __importDefault(require("express"));
const express_session_1 = __importDefault(require("express-session"));
const http = __importStar(require("http"));
const bodyparser = __importStar(require("body-parser"));
const winston = __importStar(require("winston"));
const expressWinston = __importStar(require("express-winston"));
const path_1 = __importDefault(require("path"));
const cors_1 = __importDefault(require("cors"));
const users_routes_config_1 = require("./users/users.routes.config");
const demo_routes_config_1 = require("./demo/demo.routes.config");
const auth_routes_config_1 = require("./auth/auth.routes.config");
const debug_1 = __importDefault(require("debug"));
const configs_1 = require("./configs");
const passport_1 = __importDefault(require("passport"));
const swaggerUi = require("swagger-ui-express");
const fs = require("fs");
require("./common/services/redis.service");
require("./common/services/passport.service");
require("./common/services/firebase.service");
require("./common/services/firebase-admin.service");
const app = (0, express_1.default)();
const server = http.createServer(app);
const port = configs_1.serverConfigs.PORT;
const routes = [];
const debugLog = (0, debug_1.default)('app');
const swaggerFile = (process.cwd() + "/swagger.json");
const swaggerData = fs.readFileSync(swaggerFile, 'utf8');
const customCss = fs.readFileSync((process.cwd() + "/swagger.css"), 'utf8');
const swaggerDocument = JSON.parse(swaggerData);
app.use(bodyparser.json({ limit: '1mb' }));
app.use((0, express_session_1.default)({ secret: configs_1.auth.JWT_SECRET, resave: true, saveUninitialized: true }));
const corsOptions = {
    origin: "*",
    optionSuccessStatus: 200,
};
app.use((0, cors_1.default)(corsOptions));
app.set('trust proxy', true);
app.use(express_1.default.static(path_1.default.join(__dirname, "public")));
// app.use(helmet());
const loggerOptions = {
    transports: [new winston.transports.Console()],
    format: winston.format.combine(winston.format.json(), winston.format.prettyPrint(), winston.format.colorize({ all: true })),
};
if (!configs_1.serverConfigs.DEBUG) {
    loggerOptions.meta = false; // when not debugging, make terse
    if (typeof global.it === 'function') {
        loggerOptions.level = 'http'; // for non-debug test runs, squelch entirely
    }
}
app.use(expressWinston.logger(loggerOptions));
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
routes.push(new users_routes_config_1.UsersRoutes(app));
routes.push(new demo_routes_config_1.DemoRoutes(app));
routes.push(new auth_routes_config_1.AuthRoutes(app));
app.get('/', (req, res) => {
    res.status(200).send(`Server running at http://localhost:${port}`);
});
app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerDocument, customCss));
exports.default = server.listen(port, () => {
    debugLog(`Server running at http://localhost:${port}`);
    console.log(`✅ ✨  Server running at http://localhost:${port}`);
    routes.forEach((route) => {
        debugLog(`Routes configured for ${route.getName()}`);
    });
});
