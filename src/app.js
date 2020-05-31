
const express = require('express');
const fetch = require('node-fetch');
const app = express();
const wrapperService = require('./services/wrapper.service')

const {
    vkUsers,
    vkUsersGroups,
} = require('./models/control');

const clb = async (token, i, offset, count) => {

    const response = await fetch(`https://api.vk.com/method/users.get?user_ids=${i}&fields=city,sex&name_case=nom&v=5.103&access_token=${token}`);
    const dataUser = await response.json();

    if (dataUser.response && dataUser.response[0].deactivated !== 'deleted' && dataUser.response[0].deactivated !== 'banned') {

        console.log(dataUser.response[0])

        const user = await vkUsers.findOne({ where: { id: i } });

        if (!user) {
            if (dataUser.response[0].city) {
                await vkUsers.create({
                    sex: dataUser.response[0].sex,
                    city: dataUser.response[0].city.id,
                })
            } else {
                await vkUsers.create({
                    sex: dataUser.response[0].sex,
                    city: null,
                })
            }
        }

        const response = await fetch(`https://api.vk.com/method/groups.get?user_id=${i}&offset=${offset}&count=${count}&v=5.103&access_token=${token}&scope=offline`);
        const data = await response.json();

        if (data.response) {
            const { items } = data.response;
            if (items) {
                if (items.length !== 0) {
                    console.log('user: ' + i)
                    console.log('groups: ' + items.length);

                    for (item of items) {
                        await vkUsersGroups.create({
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
    } else
        return 0;

}

app.listen(8080, () => {
    wrapperService.get(clb);
    console.log('start worker')
})

// 'https://oauth.vk.com/authorize?client_id=7406054&display=page&redirect_uri=&scope=friends,groups&response_type=token&v=5.52'
