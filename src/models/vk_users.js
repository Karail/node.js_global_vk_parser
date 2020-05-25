'use strict';

const Sequelize = require('sequelize')
const sequelize = require('../../db/db')

const VKgroupF = (sequelize, DataTypes) => {
  const VKgroup = sequelize.define('vk_users', {
    id: {
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    city: {
      type: DataTypes.INTEGER
    },
    sex: {
      type: DataTypes.INTEGER
    }
  }, {});
  VKgroup.associate = function(models) {
    // associations can be defined here
  };
  return VKgroup;
};

module.exports = VKgroupF(sequelize, Sequelize)