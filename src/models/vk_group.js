'use strict';

const Sequelize = require('sequelize')
const sequelize = require('../../db/db')

const VKgroupF = (sequelize, DataTypes) => {
  const VKgroup = sequelize.define('vk_groups', {
    id: {
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
  }, {});
  VKgroup.associate = function(models) {
    // associations can be defined here
  };
  return VKgroup;
};

module.exports = VKgroupF(sequelize, Sequelize)