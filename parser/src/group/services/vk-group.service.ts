import fetch from 'node-fetch';
import { Op } from 'sequelize';
// Services
import { Logger } from '../../shared/services';
// Models
import { VkUser, VkUserGroup, VkToken } from '../models';

export class VkGroupService {

    /**
     * Запускает весный парсер
     * @param token - Токен VK для запросов к api
     * @param from - Id первого затрагиваемого пользователя
     * @param to - Id последнего затрагиваемого пользователя
     */
    public parse(token: string, from: number, to: number) {
        const delay = 500;

        let fromId = from;
        let toId = to;
        let offsetGroup = 0;
        let users: VkUser[] = [];
        let isUpdate = false;

        setTimeout(run.bind(this), delay);

        async function run(this: VkGroupService) {
            try {
                if (isUpdate) {
                    offsetGroup = await this.toParse(token, users[fromId].vkId, offsetGroup);

                    if (offsetGroup === 0) { // Если у пользователя не осталось групп, переходим к следующему
                        fromId++;
                    }
                    if (fromId >= users.length) { // Если пользователи кончились, начинаем с первого
                        fromId = 0;
                    }
                }
                else {
                    offsetGroup = await this.toParse(token, fromId, offsetGroup);

                    if (offsetGroup === 0) { // Если у пользователя не осталось групп, переходим к следующему
                        fromId++;
                    }
                    if (fromId >= toId) { // Если пользователи кончились, ищем пользователей по массиву
                        isUpdate = true;

                        users = await VkUser.findAll({
                            where: {
                                vkId: {
                                    [Op.gte]: from,
                                    [Op.lte]: to,
                                }
                            },
                            order: [['vkId', 'ASC']]
                        });

                        fromId = 0;
                    }
                }
                setTimeout(run.bind(this), delay);
            } catch (e) {
                Logger.error(e);
                throw e;
            }
        }
    }

    /**
     * Бизнес-логика парсера
     * @param token - Токен VK для запросов к api
     * @param id - Id пользователя 
     * @param offsetGroup - Сдвиг запрашиваемых групп
     */
    private async toParse(token: string, id: number, offsetGroup: number): Promise<number> {
        try {
            console.log('id', id);
            const response = await fetch(`https://api.vk.com/method/users.get?user_ids=${id}&fields=city,sex,has_photo&name_case=nom&v=5.103&access_token=${token}&scope=offline`);
            const dataUser = await response.json();

            // Если пользователь заблокирован или удален не парсим его
            if (
                dataUser.response &&
                dataUser.response[0].deactivated !== 'deleted' &&
                dataUser.response[0].deactivated !== 'banned'
            ) {

                const user = await VkUser.findOne({ where: { vkId: id } });

                const { sex, city, has_photo } = dataUser.response[0];

                if (!user) {
                    await VkUser.create({
                        vkId: id,
                        sex,
                        city: city?.id,
                        has_photo
                    });
                }
                else {
                    await user.update({
                        sex,
                        city: city?.id,
                        has_photo
                    })
                }

                const response = await fetch(`https://api.vk.com/method/groups.get?user_id=${id}&offset=${offsetGroup}&count=1000&v=5.103&access_token=${token}&scope=offline`);
                const dataGroup = await response.json();

                if (dataGroup.response) {
                    const { items } = dataGroup.response;
                    if (items?.length > 0) {

                        if (offsetGroup === 0) {
                            await VkUserGroup.destroy({
                                where: {
                                    user_id: id
                                }
                            });
                        }

                        VkUserGroup.bulkCreate(
                            items.map((group_id: any) => ({ user_id: id, group_id }))
                        );
                        console.log('групп', items?.length);
                        if (items.length == 1000) {
                            return offsetGroup += 1000;
                        }
                    }
                }
            }

            return 0;
        } catch (e) {
            Logger.error(e);
            throw e;
        }
    }
}