import {List} from '../../src/database/models/List';

export default async () => {
    return await List.create({
        title: 'Test List',
        order: 1,
    });
};