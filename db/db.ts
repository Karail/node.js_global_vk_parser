

const Sequelize = require('sequelize');

export default new Sequelize('vk', 'root', 'joker2002', {
    dialect: 'mysql',
    host: 'localhost',
    define: {
        timestamps: false
    }
})