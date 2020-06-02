
import { Sequelize } from "sequelize-typescript"
import { VK_UserGroup, VK_User } from './models/';

const sequelize = new Sequelize('vk2', 'root', 'joker2002', {
    host: 'localhost',
    dialect: 'mysql',
    define: {
        timestamps: false
    },
    models: [__dirname + './models']
});

sequelize.addModels([VK_UserGroup, VK_User]);

export default sequelize;