
import * as express from 'express';
import sequelize from './database';
import searchRouter from './routes/search.router';

const app = express();

app.use('/search', searchRouter);

app.listen(8080, async () => {
    try {
        await sequelize.authenticate()
        await sequelize.sync()
        console.log("start server")
    } catch (ex) {
        console.log(ex);
    }
});