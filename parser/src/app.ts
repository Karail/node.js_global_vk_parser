import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
// Services
import { AppService } from './app.service';
import { Logger } from './shared/services';
// Database
import { sequelize } from './database';

const app = express();

app.listen(process.env.APP_PORT, async () => {
    try {
        await sequelize.sync();

        new AppService();

        Logger.info(`start parser-app port:${process.env.APP_PORT}`);

    } catch (e) {
        Logger.error(e);
        throw e;
    }
});

// https://oauth.vk.com/authorize?client_id=7406054&display=page&redirect_uri=&scope=friends,groups&response_type=token&v=5.52
