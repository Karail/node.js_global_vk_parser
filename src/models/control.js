

let vkGroup = require('./vk_group');
let vkUsers = require('./vk_users');
let vkUsersGroups = require('./vk_users_groups');


vkGroup.belongsToMany(vkUsers, {
    through: vkUsersGroups,
    foreignKey: 'group_id'
});
vkUsers.belongsToMany(vkGroup, {
    through: vkUsersGroups,
    foreignKey: 'user_id'
});

module.exports = {
    vkGroup,
    vkUsers,
    vkUsersGroups,
}