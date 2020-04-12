import { Column, DataType, Model, Table } from 'sequelize-typescript';

@Table({
    tableName: 'VKcategory',
})
class VKcategory extends Model<VKcategory> {

    @Column({
        allowNull: false,
        type: DataType.INTEGER,
    })
    id!: number;

    @Column({
        allowNull: false,
        type: DataType.STRING,
    })
    name!: string;

}

export default VKcategory;
