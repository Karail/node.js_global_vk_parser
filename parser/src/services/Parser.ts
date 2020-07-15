import fetch from 'node-fetch';
import { VK_User, VK_UserGroup } from '../models';

export class Parser {

    constructor(
        public token: string,
    ) { }

    run(start: number, end: number) {
        try {

            let startId = start;

            let countGroup = 1000;

            let offsetGroup = 0;

            const time = 700;

            async function runTimer() {

                offsetGroup = await this.toParse(startId, offsetGroup, countGroup)

                if (offsetGroup === 0)
                    startId++;

                if (startId >= end) {
                    clearTimeout(timer);
                    this.runUpdate(start, end)
                } else
                    setTimeout(runTimer.bind(this), time);

            }

            const timer = setTimeout(runTimer.bind(this), time);

        } catch (ex) {
            console.log(ex);
        }
    }

    async toParse(
        id: number,
        offsetGroup: number,
        countGroup: number
    ): Promise<number> {

        try {
            const response = await fetch(`
            https://api.vk.com/method/users.get?user_ids=${id}&fields=city,sex,last_seen,domain,has_photo&name_case=nom&v=5.103&access_token=${this.token}&scope=offline`);
            const dataUser = await response.json();

            const user = await VK_User.findByPk(id);

            if (!user) {
                console.log(dataUser)
            }

            if (
                dataUser.response &&
                dataUser.response[0].deactivated !== 'deleted' &&
                dataUser.response[0].deactivated !== 'banned'
            ) {

                const response = await fetch(`
                https://api.vk.com/method/groups.get?user_id=${id}&offset=${offsetGroup}&count=${countGroup}&v=5.103&access_token=${this.token}&scope=offline`);
                const data = await response.json();

                if (data.response) {
                    const { items } = data.response;
                    if (items && items.length > 0) {

                        const { sex, city, has_photo, domain } = dataUser.response[0];

                        if (!user) {
                            await VK_User.create({
                                id,
                                sex,
                                city: city ? dataUser.response[0].city.id : null,
                                has_photo,
                                domain
                            });
                        }

                        for (let item of items) {
                            await VK_UserGroup.create({
                                user_id: id,
                                group_id: item,
                            })
                        }

                        return offsetGroup += countGroup;
                    } else
                        return 0;
                } else
                    return 0;
            } else
                return 0;
        } catch (ex) {
            console.log(ex);
        }
    }

    async runUpdate(start: number, end: number) {
        try {

            let countGroup = 1000;

            let offsetGroup = 0;

            const time = 700;

            const users = await VK_User.findAll({
                limit: end,
                offset: start - 1,
                order: [['id', 'DESC']]
            });

            let userId = 0;

            async function runTimer() {

                console.log(users[userId].get())

                offsetGroup = await this.toParseUpdate(users[userId].id, offsetGroup, countGroup)

                if (offsetGroup === 0) {
                    userId++;
                }


                if (userId >= users.length) {

                    this.runUpdate(start, end)

                } else
                    setTimeout(runTimer.bind(this), time);

            }

            const timer = setTimeout(runTimer.bind(this), time);

        } catch (ex) {
            console.log(ex);
        }
    }

    looprun() {

    }

    async toParseUpdate(
        id: number,
        offsetGroup: number,
        countGroup: number,
    ): Promise<number> {

        try {

            const user = await VK_User.findByPk(id);

            if (user) {

                const response = await fetch(`
                https://api.vk.com/method/users.get?user_ids=${id}&fields=city,sex,last_seen,domain,has_photo&name_case=nom&v=5.103&access_token=${this.token}&scope=offline`);
                const dataUser = await response.json();

                if (
                    dataUser.response &&
                    dataUser.response[0].deactivated !== 'deleted' &&
                    dataUser.response[0].deactivated !== 'banned'
                ) {

                    const response = await fetch(`
                    https://api.vk.com/method/groups.get?user_id=${id}&offset=${offsetGroup}&count=${countGroup}&v=5.103&access_token=${this.token}&scope=offline`);
                    const data = await response.json();

                    if (data.response) {

                        const { items } = data.response;

                        console.log(data)

                        if (items && items.length > 0) {

                            const { sex, city, has_photo, domain } = dataUser.response[0]

                            await VK_User.update({
                                id,
                                sex,
                                city: city ? dataUser.response[0].city.id : null,
                                has_photo,
                                domain
                            }, {
                                where: { id }
                            });

                            if (offsetGroup === 0) {
                                await VK_UserGroup.destroy({
                                    where: {
                                        user_id: id
                                    }
                                })
                            }

                            for (let item of items) {
                                await VK_UserGroup.create({
                                    user_id: id,
                                    group_id: item,
                                })
                            }

                            return offsetGroup += countGroup;
                        } else
                            return 0;
                    } else
                        return 0;
                } else
                    return 0;
            } else
                return 0;


        } catch (ex) {
            console.log(ex);
        }
    }
}

