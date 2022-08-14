/**
 * File: src/index.ts
 * @version 1.0.0
 * @author Sam Hoque
 * @description This is the entry point for the application.
 */
import 'dotenv/config';
import "reflect-metadata";
import express from "express";
import {ApolloServer} from "apollo-server-express";
import {buildSchema} from "type-graphql";
import {ListResolver} from "./resolvers/ListResolver";
import {Sequelize} from 'sequelize-typescript'

/**
 * @description initialize the express application and the apollo server
 */
(async () => {
    // set up the database
    const sequelize = new Sequelize({
        dialect: 'mysql',
        host: process.env.DB_HOST,
        port: Number(process.env.DB_PORT),
        username: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        logging: Boolean(process.env.DB_LOGGING),
        modelPaths: [__dirname + '/database/models'],
    });
    await sequelize.sync();


    // set up the express application
    const app = express();
    const schema = await buildSchema({
        resolvers: [ListResolver],
    });

    // create the apollo server
    const apolloServer = new ApolloServer({
        schema,
        context: ({req}) => ({req})
    });

    await apolloServer.start();
    apolloServer.applyMiddleware({app});

    // start the server
    app.listen(4000, () => {
        console.log("server started on http://localhost:4000/graphql");
    });
})();