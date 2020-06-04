
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
            '3cb947448646e5706a54cb9d5cce40e356e7dea35e4c96d4f0d067786e104b89462e8fb25a2215f104faa',
            // '55aad4b1f7b3b6ecbca2cddcf7fd95e5e5ab83165d4e8e21222802f37263989aed68a4b4a962bca958e89',
            181199424,
            181199425
        );

        parser.run()

    } catch (ex) {
        console.log(ex);
    }
})

// https://oauth.vk.com/authorize?client_id=7406054&display=page&redirect_uri=&scope=friends,groups&response_type=token&v=5.52
