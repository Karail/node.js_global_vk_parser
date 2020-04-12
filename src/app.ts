
import express from 'express';
import fetch from 'node-fetch';
import sequelize from '../db/db';
import { vk_token } from '../conf/conf';
const app = express()

import { VKcategory } from './models/';

async function getVKcategory() {
    try {
        const response_Category = await fetch(`https://api.vk.com/method/groups.getCatalogInfo?v=5.103&subcategories=1&access_token=${vk_token}`);
        const data_Category = await response_Category.json();
        const { categories } = data_Category.response;
        for (let el_Category of categories) {
            // await VKgroup.create(el);
            console.log(el_Category);

            const response_Group = await fetch(`https://api.vk.com/method/groups.getCatalog?category_id=${el_Category.id}&v=5.103&access_token=${vk_token}`);
            const data_Group = await response_Group.json();
            const { items } = data_Group.response;
            console.log(items.length)
   
        }

    } catch (err) {
        console.log(err);
    }
}


app.listen(8080, async () => {
    try {
        await sequelize.sync({ alter: true })
        getVKcategory()
        console.log('start worker')
    } catch (err) {
        console.log(err);
    }
})