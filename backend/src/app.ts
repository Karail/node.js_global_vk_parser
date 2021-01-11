
import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
// Services
import { Logger } from './shared/services';
// Routes
import { groupRouter } from './group/routes';
// Database
import { sequelize } from './database';

const app = express();

app.use('/group', groupRouter);

app.listen(process.env.APP_PORT, async () => {
    try {
        await sequelize.sync();

        Logger.info(`start backend-app port:${process.env.APP_PORT}`);

    } catch (e) {
        Logger.error(e);
        throw e;
    }
});