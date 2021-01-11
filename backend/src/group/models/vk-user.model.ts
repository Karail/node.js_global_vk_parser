import { Table, Model, Column, DataType } from 'sequelize-typescript';

@Table({
    modelName: 'vk_users'
})
export class VkUser extends Model<VkUser> {

    @Column
    vkId!: number;
}