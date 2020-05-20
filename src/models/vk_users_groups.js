'use strict';

const Sequelize = require('sequelize')
const sequelize = require('../../db/db')

const VKgroupF = (sequelize, DataTypes) => {
  const VKgroup = sequelize.define('vk_users_groups', {
    user_id: {
      allowNull: false,
      type: DataTypes.INTEGER
    },
    group_id: {
      allowNull: false,
      type: DataTypes.INTEGER
    },
  }, {});
  VKgroup.associate = function(models) {
    // associations can be defined here
  };
  return VKgroup;
};

module.exports = VKgroupF(sequelize, Sequelize)