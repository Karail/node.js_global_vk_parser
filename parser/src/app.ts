
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
            '2aef4434f88df5361e45d7d7b39c14f94b2b9d758208c34b312a8ddc839034c50593040677bb4bae8e9b6',
            1,
            10
        );

        parser.run()

    } catch (ex) {
        console.log(ex);
    }
})

// https://oauth.vk.com/authorize?client_id=7406054&display=page&redirect_uri=&scope=friends,groups&response_type=token&v=5.52
