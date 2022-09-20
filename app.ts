import dotenv from 'dotenv';
const dotenvResult = dotenv.config();
if (dotenvResult.error) {
    throw dotenvResult.error;
}

import express from 'express';
import session from 'express-session';
import * as http from 'http';
import * as bodyparser from 'body-parser';
import * as winston from 'winston';
import * as expressWinston from 'express-winston';
import path from 'path';
import cors from 'cors';
import { CommonRoutesConfig } from './common/common.routes.config';
import { UsersRoutes } from './users/users.routes.config';
import { DemoRoutes } from './demo/demo.routes.config';
import { AuthRoutes } from './auth/auth.routes.config';
import debug from 'debug';
import helmet from 'helmet';
import {serverConfigs, auth} from './configs';
import passport from "passport";
import swaggerUi = require('swagger-ui-express');
import fs = require('fs');

import './common/services/redis.service';
import './common/services/passport.service';
import './common/services/firebase.service';
import './common/services/firebase-admin.service';

const app: express.Application = express();
const server: http.Server = http.createServer(app);
const port = serverConfigs.PORT;
const routes: Array<CommonRoutesConfig> = [];
const debugLog: debug.IDebugger = debug('app');

const swaggerFile = (process.cwd()+"/swagger.json");
const swaggerData: any = fs.readFileSync(swaggerFile, 'utf8');
const customCss: any = fs.readFileSync((process.cwd()+"/swagger.css"), 'utf8');
const swaggerDocument = JSON.parse(swaggerData);

app.use(bodyparser.json({limit: '1mb'}));
app.use(session({ secret: auth.JWT_SECRET, resave: true, saveUninitialized: true }));
const corsOptions = {
    origin: "*",
    optionSuccessStatus: 200,
};
app.use(cors(corsOptions));
app.set('trust proxy', true);
app.use(express.static(path.join(__dirname, "public")));
// app.use(helmet());

const loggerOptions: expressWinston.LoggerOptions = {
    transports: [new winston.transports.Console()],
    format: winston.format.combine(
        winston.format.json(),
        winston.format.prettyPrint(),
        winston.format.colorize({ all: true })
    ),
};

if (!serverConfigs.DEBUG) {
    loggerOptions.meta = false; // when not debugging, make terse
    if (typeof global.it === 'function') {
        loggerOptions.level = 'http'; // for non-debug test runs, squelch entirely
    }
}

app.use(expressWinston.logger(loggerOptions));

app.use(passport.initialize());
app.use(passport.session())

routes.push(new UsersRoutes(app));
routes.push(new DemoRoutes(app));
routes.push(new AuthRoutes(app));

app.get('/', (req: express.Request, res: express.Response) => {
    res.status(200).send(`Server running at http://localhost:${port}`);
});

app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerDocument,  customCss));
export default server.listen(port, () => {
    debugLog(`Server running at http://localhost:${port}`);
    console.log(`✅ ✨  Server running at http://localhost:${port}`);
    routes.forEach((route: CommonRoutesConfig) => {
        debugLog(`Routes configured for ${route.getName()}`);
    });
});
