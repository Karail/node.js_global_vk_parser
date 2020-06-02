
import * as express from 'express';
import fetch from 'node-fetch';
import sequelize from './database';
import { WrapperService } from './services/wrapper.service';
const app = express();

import { VK_User, VK_UserGroup } from './models/';

const clb = async (token, i, offset, count): Promise<number> => {

    const response = await fetch(`https://api.vk.com/method/users.get?user_ids=${i}&fields=city,sex,last_seen,domain,has_photo&name_case=nom&v=5.103&access_token=${token}&scope=offline`);
    const dataUser = await response.json();

    console.log(dataUser)

    if (dataUser.response && dataUser.response[0].deactivated !== 'deleted' && dataUser.response[0].deactivated !== 'banned') {

        const user = await VK_User.findOne({ where: { id: i } });

        console.log(dataUser.response[0])
        if (!user) {
            if (dataUser.response[0].city) {
                await VK_User.create({
                    sex: dataUser.response[0].sex,
                    city: dataUser.response[0].city.id,
                    has_photo: dataUser.response[0].has_photo,
                    domain: dataUser.response[0].domain
                })
            } else {
                await VK_User.create({
                    sex: dataUser.response[0].sex,
                    city: null,
                    has_photo: dataUser.response[0].has_photo,
                    domain: dataUser.response[0].domain
                })
            }
        }

        const response = await fetch(`https://api.vk.com/method/groups.get?user_id=${i}&offset=${offset}&count=${count}&v=5.103&access_token=${token}&scope=offline`);
        const data = await response.json();
        if (data.response) {
            const { items } = data.response;
            if (items && items.length > 0) {
                console.log('user: ' + i)
                console.log('groups: ' + items.length);

                for (let item of items) {
                    await VK_UserGroup.create({
                        user_id: i,
                        group_id: item,
                    })
                }

                return offset += count;
            } else
                return 0;
        } else
            return 0;
    } else
        return 0;

}

app.listen(8082, async () => {
    try {
        await sequelize.authenticate()
        await sequelize.sync()
        console.log("start server")
        WrapperService.get(
            clb,
            '2aef4434f88df5361e45d7d7b39c14f94b2b9d758208c34b312a8ddc839034c50593040677bb4bae8e9b6',
            1,
            3000
        );
    } catch (ex) {
        console.log(ex);
    }
})

// https://oauth.vk.com/authorize?client_id=7406054&display=page&redirect_uri=&scope=friends,groups&response_type=token&v=5.52
