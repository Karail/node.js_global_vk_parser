import { Sequelize } from "sequelize-typescript"
// Models
import { VkUserGroup, VkUser, VkToken } from '../group/models';

const sequelize = new Sequelize(
    String(process.env.DB_NAME),
    String(process.env.DB_USER),
    String(process.env.DB_PASSWORD),
    {
        host: String(process.env.DB_HOST),
        dialect: 'postgres',
        define: {
            timestamps: false
        },
        models: [__dirname + '../group/models'],
        logging: false
    });

sequelize.addModels([VkUserGroup, VkUser, VkToken]);

export default sequelize;