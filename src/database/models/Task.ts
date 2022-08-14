import {Table, Column, Model, BelongsTo, ForeignKey, Default} from 'sequelize-typescript'
import {List} from "./List";
import {Int, ObjectType, Field} from "type-graphql";

@ObjectType()
@Table({timestamps: true,})
export class Task extends Model {

    @Field(() => Int)
    @Column({primaryKey: true, autoIncrement: true, unique: true})
    id: number

    @Field()
    @Column
    title: string

    @Field(() => Int)
    @Default(1)
    @Column
    order: number

    @Field(() => Int)
    @ForeignKey(() => List)
    @Column
    listId: number

    /**
     * This does not work due to a bug with the library, I have created a work around below.
     * @url https://github.com/sequelize/sequelize-typescript/issues/778
     */
    @Field(() => List)
    @BelongsTo(() => List)
    list: List

    @Field(() => List)
    async getList(): Promise<List> {
        return await List.findOne({where: {id: this.listId}});
    }

    @Field(() => Int)
    @Default(0)
    @Column
    status: number
}