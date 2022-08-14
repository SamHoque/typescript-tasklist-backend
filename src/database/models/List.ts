import {Table, Column, Model, HasMany, Default} from 'sequelize-typescript'
import {Task} from './Task'
import {Field, Int, ObjectType} from "type-graphql";

@ObjectType()
@Table({timestamps: true,})
export class List extends Model {

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

    /**
     * This does not work due to a bug with the library, I have created a work around below.
     * @url https://github.com/sequelize/sequelize-typescript/issues/778
     */
    @Field(() => [Task])
    @HasMany(() => Task)
    tasks: Task[]

    @Field(() => [Task])
    async getTasks(): Promise<Task[]> {
        return await Task.findAll({where: {listId: this.id}});
    }
}