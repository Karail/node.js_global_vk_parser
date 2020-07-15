
import * as express from 'express';
import sequelize from './database';
import { Parser } from './services/Parser';
const app = express();

app.listen(8082, async () => {
    try {
        await sequelize.authenticate()
        await sequelize.sync()
        console.log("start server")

        const parser = new Parser(
            '25d2a9be91f3e7dbfbd6890e11f66b8a97372efa02082ccb5f6888da4c8f2fce21a85bcc905d0695c61ee',
        );

        parser.run(
            1,
            6
        );

    } catch (ex) {
        console.log(ex);
    }
});

// https://oauth.vk.com/authorize?client_id=7406054&display=page&redirect_uri=&scope=friends,groups&response_type=token&v=5.52
