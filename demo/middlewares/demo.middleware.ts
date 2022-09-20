import express from 'express';

class DemoMiddleware {
    async extractId(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        req.body.id = req.params.id;
        next();
    }
}

export default new DemoMiddleware();
