import { Table, Model, Column, DataType } from 'sequelize-typescript';


@Table({
    modelName: 'vk_users'
})
export class VK_User extends Model<VK_User> {

    @Column
    city: number;

    @Column
    sex: number;

    @Column
    has_photo: number;

    @Column
    domain: string;
}