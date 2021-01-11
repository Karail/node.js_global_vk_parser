import { Table, Model, Column, DataType } from 'sequelize-typescript';

@Table({
    modelName: 'vk_tokens',
    timestamps: true,
})
export class VkToken extends Model<VkToken> {

    @Column
    platform!: string;

    @Column
    hash!: string;

    @Column
    active!: boolean;
    
}