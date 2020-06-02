import { Table, Model, Column, AllowNull, } from 'sequelize-typescript';


@Table({
    modelName: 'vk_users_groups'
})
export class VK_UserGroup extends Model<VK_UserGroup> {

    @AllowNull(false)
    @Column
    user_id: number;

    @AllowNull(false)
    @Column
    group_id: number;

}