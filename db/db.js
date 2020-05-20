

const Sequelize = require('sequelize');

module.exports = new Sequelize('vk', 'root', 'joker2002', {
    dialect: 'mysql',
    host: 'localhost',
    define: {
        timestamps: false
    }
})