import { Request, Response } from 'express';
import * as Sequelize from 'sequelize';
import sequelize from '../database';
import { VK_UserGroup, VK_User } from '../models/';

const Op = Sequelize.Op;

class SearchController {
    async search(req: Request, res: Response) {
        try {
            const { id, sex, city, has_photo } = req.query

            const primaryUserId = id
            let spentUser = []
            let resSecondaryUser = []

            const primaryUser = await VK_User.findByPk(Number(primaryUserId))

            if (!primaryUser)
                throw new Error('user is not exist')

            const primaryUserGroup_arr = await VK_UserGroup.findAll({
                where: {
                    user_id: primaryUserId
                },
                attributes: ['group_id'],
            }).map((el) => el.group_id)
            console.log(primaryUserGroup_arr)


            for (let primaryUserGroup of primaryUserGroup_arr) {

                const secondaryUser_arr = await VK_UserGroup.findAll({
                    where: {
                        group_id: primaryUserGroup,
                        [Op.and]: {
                            user_id: {
                                [Op.ne]: primaryUserId
                            }
                        }
                    },
                    attributes: ['user_id']
                }).map((el) => el.user_id)



                for (let secondaryUserId of secondaryUser_arr) {

                    if (spentUser.indexOf(secondaryUserId) === -1) {

                        type matchingType = {
                            group_id: number
                        }

                        const [matching] = await sequelize.query(`
                        select group_id from vk_users_groups join (
                            select group_id from vk_users_groups  WHERE user_id = ${secondaryUserId} group by group_id 
                        ) equ using (group_id) WHERE user_id = ${primaryUserId}
                    `);

                        const percent = (matching.length / primaryUserGroup_arr.length * 100).toFixed(2)

                        const user = await VK_User.findByPk(secondaryUserId)

                        resSecondaryUser.push({
                            response: {
                                count: matching.length,
                                percent,
                                user,
                                groups: matching.map((el: matchingType) => el.group_id)
                            },
                        })

                        spentUser.push(secondaryUserId)
                    }
                }
            }
            res.json(resSecondaryUser)
        } catch (ex) {
            console.log(ex);
            res.status(500).json(ex.message);
        }
    }
}

export default new SearchController();