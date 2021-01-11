import { Table, Model, Column, AllowNull, Index, } from 'sequelize-typescript';

@Table({
    modelName: 'vk_users_groups'
})
export class VkUserGroup extends Model<VkUserGroup> {

    @AllowNull(false)
    @Index({
        using: 'BTREE',
    })
    @Column
    user_id!: number;

    @AllowNull(false)
    @Index({
        using: 'BTREE',
    })
    @Column
    group_id!: number;

}