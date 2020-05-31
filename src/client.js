
const Sequelize = require('sequelize');
const express = require('express');
const sequelize = require('../db/db');


const {
    vkUsers,
    vkUsersGroups,
} = require('./models/control');

const Op = Sequelize.Op;

const search = async () => {
    const primaryUser = 6
    let spentUser = []

    const primaryUserGroup_arr = await vkUsersGroups.findAll({
        where: {
            user_id: primaryUser
        },
        attributes: ['group_id']
    }).map((el) => el.group_id)

    for (let primaryUserGroup of primaryUserGroup_arr) {

        const secondaryUser_arr = await vkUsersGroups.findAll({
            where: {
                group_id: primaryUserGroup,
                [Op.and]: {
                    user_id: {
                        [Op.ne]: primaryUser
                    }
                }
            },
            attributes: ['user_id']
        }).map((el) => el.user_id)

        for (let secondaryUser of secondaryUser_arr) {

            if (spentUser.indexOf(secondaryUser) === -1) {

                const [matching] = await sequelize.query(`
                    select group_id from vk_users_groups join (
                        select group_id from vk_users_groups  WHERE user_id = ${secondaryUser} group by group_id 
                    ) equ using (group_id) WHERE user_id = ${primaryUser}
                `);
                console.log(`колличество совпадений c юзером ${secondaryUser}: `, matching.length)
                console.log(`процентное соотношение с юзером ${secondaryUser}: ${(matching.length / primaryUserGroup_arr.length * 100).toFixed(2)}%`)
                console.log(`список схожих групп с юзером ${secondaryUser}: `, matching)
                spentUser.push(secondaryUser)
            }

        }
    }
}

search();