import {Arg, Mutation, Query, Resolver} from "type-graphql";
import {List} from "../database/models/List";
import {Task} from "../database/models/Task";

@Resolver()
export class ListResolver {

    @Query(() => [List])
    async lists(): Promise<List[]> {
        return await List.findAll();
    }

    @Mutation(() => List)
    async createList(
        @Arg("title") title: string,
        @Arg("order", () => Number, {nullable: true}) order: number | null
    ): Promise<List> {
        return await List.create({title, order});
    }

    @Mutation(() => List)
    async updateList(
        @Arg("id", () => Number) id: number,
        @Arg("title", () => String, {nullable: true}) title: string | null,
        @Arg("order", () => Number, {nullable: true}) order: number | null
    ): Promise<List> {
        const list = await List.findOne({where: {id}});
        if (!list)
            throw new Error("List not found");
        await list.update({title, order});
        return list;
    }

    @Mutation(() => Boolean)
    async deleteList(
        @Arg("id", () => Number) id: number
    ): Promise<boolean> {
        const list = await List.findOne({where: {id}});
        if (!list)
            throw new Error("List not found");


        await list.destroy();
        return true;
    }

    @Query(() => [Task])
    async tasks(
        @Arg("listId", () => Number) listId: number
    ): Promise<Task[]> {
        return await Task.findAll({where: {listId}});
    }

    @Query(() => Task)
    async task(
        @Arg("id", () => Number) id: number
    ): Promise<Task> {
        return await Task.findOne({where: {id}});
    }

    @Mutation(() => Task)
    async createTask(
        @Arg("listId", () => Number) listId: number,
        @Arg("title", () => String) title: string,
        @Arg("order", () => Number, {nullable: true}) order: number | null,
        @Arg("status", () => Number, {nullable: true}) status: number | null
    ): Promise<Task> {
        //If order is null, set it to the highest primary key + 1
        if (!order) {
            order = (await Task.max("id", {where: {listId}}) as number) + 1;
        }
        return await Task.create({listId, title, order});
    }

    @Mutation(() => Task)
    async updateTask(
        @Arg("id", () => Number) id: number,
        @Arg("title", () => String, {nullable: true}) title: string | null,
        @Arg("order", () => Number, {nullable: true}) order: number | null,
        @Arg("status", () => Number, {nullable: true}) status: number | null
    ): Promise<Task> {
        const task = await Task.findOne({where: {id}});
        if (!task)
            throw new Error("Task not found");

        await task.update({title, order, status});
        return task;
    }

    @Mutation(() => Boolean)
    async deleteTask(
        @Arg("id", () => Number) id: number
    ): Promise<boolean> {
        const task = await Task.findOne({where: {id}});
        if (!task)
            throw new Error("Task not found");

        await task.destroy();
        return true;
    }
}
