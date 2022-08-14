import "mocha"
import 'dotenv/config';

import {expect} from 'chai'
import {Sequelize} from "sequelize-typescript";
import {buildSchema} from "type-graphql";
import {ListResolver} from "../src/resolvers/ListResolver";
import {ApolloServer} from "apollo-server-express";
import ListFactory from "./factories/list";
import TaskFactory from "./factories/task";

//Mock sequelize instance for unit testing
const sequelize = new Sequelize({
    dialect: 'mysql',
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME_TEST,
    logging: false,
    modelPaths: [__dirname + '/../src/database/models'],
});

before(async function () {
    await sequelize.sync({force: true});
});

describe('Database', async () => {
    it('should create a list', async () => {
        const list = await ListFactory();
        expect(list.title).to.equal('Test List');
        expect(list.order).to.equal(1);
    });

    it('should create a task', async () => {
        const list = await ListFactory();
        const task = await TaskFactory(list);
        expect(task.title).to.equal('Test Task');
        expect(task.order).to.equal(1);
        expect(task.status).to.equal(0);
    });
})

describe('GraphQL', async () => {
    const schema = await buildSchema({
        resolvers: [ListResolver],
    });

    // create the apollo server
    const apolloServer = new ApolloServer({
        schema,
        context: ({req}) => ({req})
    });


    it('should create a list', async () => {
        const {data} = await apolloServer.executeOperation({
            query: `
                mutation {
                    createList(title: "Test List", order: 1) {
                        title
                        order
                    }
                }
            `
        });

        expect(data).to.have.property('createList');
        expect(data.createList).to.have.property('title');
        expect(data.createList).to.have.property('order');
        expect(data.createList.title).to.equal('Test List');
        expect(data.createList.order).to.equal(1);
    });

    it('should create a task for a list', async () => {
        const {data: data} = await apolloServer.executeOperation({
            query: `
                mutation {
                    createTask(title: "Test Task", order: 1, listId: 1) {
                        title
                        order
                        status
                    }
                }
            `
        });

        expect(data).to.have.property('createTask');
        expect(data.createTask).to.have.property('title');
        expect(data.createTask).to.have.property('order');
        expect(data.createTask).to.have.property('status');
        expect(data.createTask.title).to.equal('Test Task');
        expect(data.createTask.order).to.equal(1);
        expect(data.createTask.status).to.equal(0);
    });

    it('should update a task', async () => {
        const {data: data} = await apolloServer.executeOperation({
            query: `
                mutation {
                    updateTask(id: 1, status: 2) {
                        title
                        order
                        status
                    }
                }
            `
        });

        expect(data).to.have.property('updateTask');
        expect(data.updateTask).to.have.property('title');
        expect(data.updateTask).to.have.property('order');
        expect(data.updateTask).to.have.property('status');
        expect(data.updateTask.status).to.equal(2);
    });

    it('should get all lists', async () => {
        const {data: data} = await apolloServer.executeOperation({
            query: `
                query {
                    lists {
                        id
                    }
                }
            `
        });


        expect(data).to.have.property('lists');
    });

    it('should get all tasks for a list', async () => {
        const {data: data} = await apolloServer.executeOperation({
            query: `
                query {
                    tasks(listId: 1) {
                        id
                    }
                }
            `
        });

        expect(data).to.have.property('tasks');
    });

    it('should get a task', async () => {
        const {data: data} = await apolloServer.executeOperation({
            query: `
                query {
                    task(id: 1) {
                        title
                    }
                }
            `
        });

        expect(data).to.have.property('task');
    })

    it('should delete a task', async () => {
        const {data: data} = await apolloServer.executeOperation({
            query: `
                mutation {
                    deleteTask(id: 1)
                }
            `
        });

        expect(data).to.have.property('deleteTask');
        expect(data.deleteTask).to.equal(true);
    })

    it('should delete a list', async () => {
        const {data: data} = await apolloServer.executeOperation({
            query: `
                mutation {
                    deleteList(id: 1)
                }
            `
        });

        expect(data).to.have.property('deleteList');
        expect(data.deleteList).to.equal(true);
    });
});