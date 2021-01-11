import { Request, Response } from 'express';
import Sequelize from 'sequelize';
import { Logger } from '../../shared/services';
// Database
import { sequelize } from '../../database';
// Models
import { VkUserGroup, VkUser } from '../models/';

const Op = Sequelize.Op;

class GroupController {
    async search(req: Request, res: Response) {
        try {
            const { id } = req.query;

            const user = await VkUser.findOne({
                where: {
                    vkId: Number(id)
                },
            });

            if (!user) {
                return res.status(400).json({ message: "user doesn't exist" });
            }

            const userGroups = await VkUserGroup.findAll({
                where: {
                    user_id: Number(id)
                },
            });

            if (!userGroups) {
                return res.status(400).json({ message: "groups doesn't exist" });
            }

            const [matching]: any[] = await sequelize.query(
                `
                SELECT * FROM vk_users_groups WHERE 
                group_id IN 
                    (SELECT group_id FROM vk_users_groups  GROUP BY group_id HAVING COUNT(*) > 1) AND 
                group_id IN 
                    (SELECT group_id FROM vk_users_groups WHERE user_id = ${id}) AND 
                user_id != ${id}`);

            const result = Array.from(matching.reduce((m: any, { user_id, group_id }: any) => {
                return m.set(user_id, [...(m.get(user_id) || []), group_id]);
            }, new Map), ([user_id, group_id]) => ({
                user_id,
                group_id,
                count: group_id.length,
                percent: (group_id.length / userGroups.length * 100).toFixed(2)
            }));

            res.json(result);
        } catch (e) {
            Logger.error(e);
            res.status(500).json({ message: e.message });
        }
    }
}

export default new GroupController();