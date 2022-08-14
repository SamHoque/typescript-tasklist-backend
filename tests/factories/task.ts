import {Task} from '../../src/database/models/Task';

export default async (List) => {
    return await Task.create({
        title: 'Test Task',
        order: 1,
        listId: List.id,
        status: 0,
    });
};