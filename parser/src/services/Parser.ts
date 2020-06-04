import fetch from 'node-fetch';
import { VK_User, VK_UserGroup } from '../models';

export class Parser {

    constructor(
        public token: string,
        public Istart: number,
        public Iend: number
    ) { }

    run() {
        try {

            let countQuery = 1000;

            let offset = 0;

            async function runTimer() {

                offset = await this.toParse(this.token, this.Istart, offset, countQuery)

                if (offset === 0)
                    this.Istart++;

                if (this.Istart >= this.Iend) {
                    clearTimeout(timer);
                    process.exit(1);
                } else
                    setTimeout(runTimer.bind(this), 700);

            }

            const timer = setTimeout(runTimer.bind(this), 700);

        } catch (ex) {
            console.log(ex);
        }
    }

    async toParse(
        token: string,
        Istart: number,
        offset: number,
        countQuery: number
    ): Promise<number> {

        try {
            const response = await fetch(`
            https://api.vk.com/method/users.get?user_ids=${Istart}&fields=city,sex,last_seen,domain,has_photo&name_case=nom&v=5.103&access_token=${token}&scope=offline`);
            const dataUser = await response.json();

            const user = await VK_User.findOne({ where: { id: Istart } });

            if (!user) {
                console.log(dataUser)
            }
            
            if (
                dataUser.response &&
                dataUser.response[0].deactivated !== 'deleted' &&
                dataUser.response[0].deactivated !== 'banned'
            ) {

                const response = await fetch(`
                https://api.vk.com/method/groups.get?user_id=${Istart}&offset=${offset}&count=${countQuery}&v=5.103&access_token=${token}&scope=offline`);
                const data = await response.json();

                if (data.response) {
                    const { items } = data.response;
                    if (items && items.length > 0) {

                        if (!user) {
                            if (dataUser.response[0].city) {
                                await VK_User.create({
                                    id: Istart,
                                    sex: dataUser.response[0].sex,
                                    city: dataUser.response[0].city.id,
                                    has_photo: dataUser.response[0].has_photo,
                                    domain: dataUser.response[0].domain
                                })
                            } else {
                                await VK_User.create({
                                    id: Istart,
                                    sex: dataUser.response[0].sex,
                                    city: null,
                                    has_photo: dataUser.response[0].has_photo,
                                    domain: dataUser.response[0].domain
                                })
                            }
                        }

                        for (let item of items) {
                            await VK_UserGroup.create({
                                user_id: Istart,
                                group_id: item,
                            })
                        }

                        return offset += countQuery;
                    } else
                        return 0;
                } else
                    return 0;
            } else
                return 0;
        } catch (ex) {
            console.log(ex)
        }

    }
}

